import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ProjectDetailModal } from './components/projects/ProjectDetailModal';
import { DemoScenariosModal } from './components/common/DemoScenariosModal';

// Functional Views
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ProjectRegistry } from './components/projects/ProjectRegistry';
import { ProjectPlanning } from './components/planning/ProjectPlanning';
import { RfpManagement } from './components/rfp/RfpManagement';
import { ContractManagement } from './components/contracts/ContractManagement';
import { ProjectDelivery } from './components/delivery/ProjectDelivery';
import { ProgressMonitoring } from './components/monitoring/ProgressMonitoring';
import { SiteInspections } from './components/inspections/SiteInspections';
import { FinanceModule } from './components/finance/FinanceModule';
import { DocumentRepository } from './components/documents/DocumentRepository';
import { IssueRiskRegister } from './components/risks/IssueRiskRegister';
import { ApprovalWorkflow } from './components/approvals/ApprovalWorkflow';
import { GisProjectMap } from './components/gis/GisProjectMap';
import { ReportsModule } from './components/reports/ReportsModule';
import { NotificationsModule } from './components/notifications/NotificationsModule';
import { AdministrationModule } from './components/admin/AdministrationModule';
import { PasscodeGate } from './components/auth/PasscodeGate';
import { DepartmentSelectionPage } from './components/auth/DepartmentSelectionPage';

interface MainContentProps {
  onLock: () => void;
  onBack?: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onLock, onBack }) => {
  const { currentNav, selectedProjectId, setSelectedProjectId, projects } = useApp();
  const [showScenariosModal, setShowScenariosModal] = useState(false);

  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId) || null
    : null;

  const renderActiveModule = () => {
    switch (currentNav) {
      case 'Dashboard':
        return <ExecutiveDashboard />;
      case 'Projects':
        return <ProjectRegistry />;
      case 'Project Planning':
        return <ProjectPlanning />;
      case 'RFP / Tenders':
        return <RfpManagement />;
      case 'Contracts':
        return <ContractManagement />;
      case 'Project Delivery':
        return <ProjectDelivery />;
      case 'Progress Monitoring':
        return <ProgressMonitoring />;
      case 'Site Inspections':
        return <SiteInspections />;
      case 'Finance':
        return <FinanceModule />;
      case 'Documents':
        return <DocumentRepository />;
      case 'Issues & Risks':
        return <IssueRiskRegister />;
      case 'Approvals':
        return <ApprovalWorkflow />;
      case 'GIS Map':
        return <GisProjectMap />;
      case 'Reports':
        return <ReportsModule />;
      case 'Notifications':
        return <NotificationsModule />;
      case 'Administration':
        return <AdministrationModule />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <Header onLock={onLock} onBack={onBack} />

      <div className="flex flex-1 relative">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
          {renderActiveModule()}
        </main>
      </div>

      {/* Floating Demo Scenarios Launcher Button - hidden per user request */}

      {/* 15 Demo Scenarios Modal (retained for programmatic access) */}
      <DemoScenariosModal
        isOpen={showScenariosModal}
        onClose={() => setShowScenariosModal(false)}
      />

      {/* Central Project Master Record Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* Departmental Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1 max-w-[1600px] mx-auto">
          <span>
            &copy; {new Date().getFullYear()} Gujarat Urban Development Mission (GUDM), Urban Development & Urban Housing Department, Govt. of Gujarat.
          </span>
          <span className="text-[11px] text-slate-400">
            Internal Departmental Prototype &bull; For Architecture Evaluation Only
          </span>
        </div>
      </footer>
    </div>
  );
};

const AppShell: React.FC = () => {
  const {
    selectedDesignation,
    setSelectedDesignation,
    selectedDepartment,
    setSelectedDepartment,
    setCurrentRole
  } = useApp();

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('gudm_plms_passcode_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [showGate, setShowGate] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('gudm_plms_passcode_unlocked') !== 'true';
    } catch {
      return true;
    }
  });

  const [isDeptConfirmed, setIsDeptConfirmed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('gudm_plms_dept_confirmed') === 'true';
    } catch {
      return false;
    }
  });

  const handleUnlock = () => {
    try {
      sessionStorage.setItem('gudm_plms_passcode_unlocked', 'true');
    } catch {
      // ignore storage errors
    }
    setIsUnlocked(true);
  };

  const handleGateComplete = () => {
    setShowGate(false);
  };

  const handleConfirmSelection = (designation: string, department: string) => {
    setSelectedDesignation(designation);
    setSelectedDepartment(department);

    // Sync corresponding dashboard role from designation
    if (designation.toLowerCase().includes('uduhd') || designation.toLowerCase().includes('udhdd')) {
      setCurrentRole('Super Administrator');
    } else if (designation.toLowerCase().includes('nodal')) {
      setCurrentRole('Mission Director');
    } else if (designation.toLowerCase().includes('state')) {
      setCurrentRole('Chief Engineer');
    } else if (designation.toLowerCase().includes('district')) {
      setCurrentRole('Project Manager');
    } else if (designation.toLowerCase().includes('block')) {
      setCurrentRole('Engineering Officer');
    }

    try {
      sessionStorage.setItem('gudm_plms_dept_confirmed', 'true');
      sessionStorage.setItem('gudm_plms_designation', designation);
      sessionStorage.setItem('gudm_plms_department', department);
    } catch {
      // ignore storage errors
    }
    setIsDeptConfirmed(true);
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem('gudm_plms_passcode_unlocked');
      sessionStorage.removeItem('gudm_plms_dept_confirmed');
      sessionStorage.removeItem('gudm_plms_designation');
      sessionStorage.removeItem('gudm_plms_department');
      localStorage.removeItem('gudm_plms_v1_selectedDesignation');
      localStorage.removeItem('gudm_plms_v1_selectedDepartment');
    } catch {
      // ignore storage errors
    }
    setSelectedDesignation('');
    setSelectedDepartment('');
    setIsUnlocked(false);
    setIsDeptConfirmed(false);
    setShowGate(true);
  };

  return (
    <>
      {isDeptConfirmed ? (
        <MainContent onLock={handleLock} onBack={() => setIsDeptConfirmed(false)} />
      ) : (
        <DepartmentSelectionPage
          initialDesignation={selectedDesignation}
          initialDepartment={selectedDepartment}
          onConfirm={handleConfirmSelection}
        />
      )}
      {showGate && (
        <PasscodeGate
          onUnlock={handleUnlock}
          onComplete={handleGateComplete}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
