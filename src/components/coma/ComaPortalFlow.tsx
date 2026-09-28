import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Landmark,
  Check,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Lock,
  FilePlus2,
  CheckCircle2,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectCategory, FundingSource, PriorityLevel } from '../../types';
import { UlbRoutineOperationsPanel } from './UlbRoutineOperationsPanel';
import {
  ProposalLifecycleFlowView,
  PROPOSAL_LIFECYCLE_STAGES
} from './ProposalLifecycleFlowView';

export type ComaUlbCategory = 'Municipality' | 'Municipal Corporation';

interface ComaPortalFlowProps {
  selectedDesignation: string;
  selectedDepartment: string;
  initialUlbType?: ComaUlbCategory | '';
  initialStep?: 'select_ulb_type' | 'proposal_screen';
  onBackToLanding: () => void;
  onLock: () => void;
  onProceedToDashboard: () => void;
}

const GUJARAT_MUNICIPAL_CORPORATIONS: { name: string; district: string }[] = [
  { name: 'Ahmedabad Municipal Corporation (AMC)', district: 'Ahmedabad' },
  { name: 'Surat Municipal Corporation (SMC)', district: 'Surat' },
  { name: 'Vadodara Municipal Corporation (VMC)', district: 'Vadodara' },
  { name: 'Rajkot Municipal Corporation (RMC)', district: 'Rajkot' },
  { name: 'Bhavnagar Municipal Corporation (BMC)', district: 'Bhavnagar' },
  { name: 'Jamnagar Municipal Corporation (JMC)', district: 'Jamnagar' },
  { name: 'Junagadh Municipal Corporation (JMC)', district: 'Junagadh' },
  { name: 'Gandhinagar Municipal Corporation (GMC)', district: 'Gandhinagar' },
  { name: 'Anand Municipal Corporation', district: 'Anand' },
  { name: 'Morbi Municipal Corporation', district: 'Morbi' },
  { name: 'Navsari Municipal Corporation', district: 'Navsari' },
  { name: 'Mehsana Municipal Corporation', district: 'Mehsana' },
  { name: 'Surendranagar Municipal Corporation', district: 'Surendranagar' },
  { name: 'Vapi Municipal Corporation', district: 'Valsad' },
  { name: 'Nadiad Municipal Corporation', district: 'Kheda' },
  { name: 'Porbandar Municipal Corporation', district: 'Porbandar' },
  { name: 'Gandhidham Municipal Corporation', district: 'Kutch' }
];

const GUJARAT_MUNICIPALITIES: { name: string; district: string }[] = [
  { name: 'Bharuch Municipality', district: 'Bharuch' },
  { name: 'Valsad Municipality', district: 'Valsad' },
  { name: 'Patan Municipality', district: 'Patan' },
  { name: 'Palanpur Municipality', district: 'Banaskantha' },
  { name: 'Bhuj Municipality', district: 'Kutch' },
  { name: 'Veraval-Patan Joint Municipality', district: 'Gir Somnath' },
  { name: 'Godhra Municipality', district: 'Panchmahal' },
  { name: 'Dahod Municipality', district: 'Dahod' },
  { name: 'Botad Municipality', district: 'Botad' },
  { name: 'Amreli Municipality', district: 'Amreli' },
  { name: 'Gondal Municipality', district: 'Rajkot' },
  { name: 'Jetpur-Navagadh Municipality', district: 'Rajkot' },
  { name: 'Kalol Municipality', district: 'Gandhinagar' },
  { name: 'Himmatnagar Municipality', district: 'Sabarkantha' },
  { name: 'Modasa Municipality', district: 'Aravalli' },
  { name: 'Ankleshwar Municipality', district: 'Bharuch' },
  { name: 'Bilimora Municipality', district: 'Navsari' },
  { name: 'Unjha Municipality', district: 'Mehsana' },
  { name: 'Visnagar Municipality', district: 'Mehsana' },
  { name: 'Dhoraji Municipality', district: 'Rajkot' }
];

export const ComaPortalFlow: React.FC<ComaPortalFlowProps> = ({
  selectedDesignation,
  selectedDepartment,
  initialUlbType = '',
  initialStep = 'select_ulb_type',
  onBackToLanding,
  onLock,
  onProceedToDashboard
}) => {
  const { createProject, submitApproval, projects, setSelectedProjectId } = useApp();

  const [step, setStep] = useState<'select_ulb_type' | 'proposal_screen'>(
    initialUlbType && initialStep === 'proposal_screen' ? 'proposal_screen' : 'select_ulb_type'
  );
  const [selectedUlbType, setSelectedUlbType] = useState<ComaUlbCategory | ''>(initialUlbType);
  const [selectedUlbEntity, setSelectedUlbEntity] = useState<string>(() => {
    try {
      return sessionStorage.getItem('gudm_plms_coma_ulb_entity') || '';
    } catch {
      return '';
    }
  });
  const [isUlbDropdownOpen, setIsUlbDropdownOpen] = useState<boolean>(false);
  const ulbDropdownRef = useRef<HTMLDivElement>(null);

  const [showProposalForm, setShowProposalForm] = useState<boolean>(false);
  const [lastCreatedProposalId, setLastCreatedProposalId] = useState<string | null>(null);
  const [viewingFlowProposalId, setViewingFlowProposalId] = useState<string | null>(null);
  const [proposalStageMap, setProposalStageMap] = useState<Record<string, number>>({});
  const [formError, setFormError] = useState<string>('');

  const ulbOptions =
    selectedUlbType === 'Municipal Corporation'
      ? GUJARAT_MUNICIPAL_CORPORATIONS
      : GUJARAT_MUNICIPALITIES;

  // Close ULB dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ulbDropdownRef.current && !ulbDropdownRef.current.contains(event.target as Node)) {
        setIsUlbDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [proposalForm, setProposalForm] = useState({
    title: '',
    ulbName: ulbOptions[0]?.name || '',
    district: ulbOptions[0]?.district || 'Ahmedabad',
    category: 'Water Supply & Sewerage' as ProjectCategory,
    infrastructureType: 'Greenfield Infrastructure' as
      | 'Greenfield Infrastructure'
      | 'Capacity Expansion'
      | 'Modernization'
      | 'Brownfield Augmentation',
    fundingSource:
      'Swarnim Jayanti Mukhya Mantri Shehri Vikas Yojana (SJMMSVY)' as FundingSource,
    estimatedCost: '',
    priority: 'High' as PriorityLevel,
    plannedStartDate: '2026-06-01',
    plannedCompletionDate: '2027-12-31',
    location: '',
    projectManager: 'Municipal Engineer / Nodal Officer',
    description: ''
  });

  const handleSelectUlbCategory = (type: ComaUlbCategory) => {
    if (selectedUlbType !== type) {
      setSelectedUlbEntity('');
    }
    setSelectedUlbType(type);
    setIsUlbDropdownOpen(false);
    const defaultList =
      type === 'Municipal Corporation' ? GUJARAT_MUNICIPAL_CORPORATIONS : GUJARAT_MUNICIPALITIES;
    setProposalForm(prev => ({
      ...prev,
      ulbName: defaultList[0].name,
      district: defaultList[0].district
    }));
    try {
      sessionStorage.setItem('gudm_plms_coma_ulb_type', type);
    } catch {
      // ignore storage error
    }
  };

  const handleSelectUlbEntityFromDropdown = (entity: { name: string; district: string }) => {
    setSelectedUlbEntity(entity.name);
    setIsUlbDropdownOpen(false);
    setProposalForm(prev => ({
      ...prev,
      ulbName: entity.name,
      district: entity.district
    }));
    try {
      sessionStorage.setItem('gudm_plms_coma_ulb_entity', entity.name);
    } catch {
      // ignore storage error
    }
  };

  const handleContinueFromUlbSelection = () => {
    if (!selectedUlbType || !selectedUlbEntity) return;
    setStep('proposal_screen');
    setShowProposalForm(false);
    setLastCreatedProposalId(null);
    try {
      sessionStorage.setItem('gudm_plms_coma_step', 'proposal_screen');
      sessionStorage.setItem('gudm_plms_coma_ulb_entity', selectedUlbEntity);
    } catch {
      // ignore storage error
    }
  };

  const handleUlbEntityChange = (ulbName: string) => {
    const matched = ulbOptions.find(u => u.name === ulbName);
    setSelectedUlbEntity(ulbName);
    setProposalForm(prev => ({
      ...prev,
      ulbName,
      district: matched ? matched.district : prev.district
    }));
    try {
      sessionStorage.setItem('gudm_plms_coma_ulb_entity', ulbName);
    } catch {
      // ignore storage error
    }
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.title.trim()) {
      setFormError('Please enter a proposal title before submitting.');
      return;
    }
    setFormError('');

    const costNum = Math.max(0.5, Number(proposalForm.estimatedCost) || 25.0);

    const created = createProject({
      name: proposalForm.title.trim(),
      category: proposalForm.category,
      type: proposalForm.infrastructureType,
      description:
        proposalForm.description.trim() ||
        `${selectedUlbType} infrastructure proposal submitted under Commissionerate of Municipal Administration (CoMA) for ${proposalForm.ulbName}.`,
      district: proposalForm.district,
      ulb: proposalForm.ulbName,
      location: proposalForm.location.trim() || `${proposalForm.ulbName} Municipal Limits`,
      department: 'CoMA - Commissionerate of Municipal Administration',
      implementingAgency: proposalForm.ulbName,
      projectManager: proposalForm.projectManager.trim() || 'Municipal Engineer (CoMA)',
      estimatedCost: costNum,
      approvedCost: costNum,
      fundingSource: proposalForm.fundingSource,
      plannedStartDate: proposalForm.plannedStartDate,
      plannedCompletionDate: proposalForm.plannedCompletionDate,
      riskLevel: 'Low',
      priority: proposalForm.priority
    });

    submitApproval({
      projectId: created.id,
      projectName: created.name,
      approvalType: 'Administrative Approval (AS)',
      amount: costNum,
      submittedBy: `${selectedDesignation || 'UDUHD official'} (${proposalForm.ulbName})`,
      submitterRole: selectedDesignation || 'UDUHD official',
      currentOfficer: 'Commissioner of Municipal Administration (CoMA)',
      dueDate: '2026-05-30',
      remarks: `New ${selectedUlbType} proposal registered via CoMA portal.`
    });

    setLastCreatedProposalId(created.id);
    setProposalStageMap(prev => ({ ...prev, [created.id]: 1 }));
    setViewingFlowProposalId(created.id);
    setShowProposalForm(false);
    setProposalForm(prev => ({
      ...prev,
      title: '',
      estimatedCost: '',
      location: '',
      description: ''
    }));
  };

  // Filter proposals strictly to those registered under CoMA by the same selected Municipal Corporation or Municipality
  const activeUlbName = selectedUlbEntity || proposalForm.ulbName;
  const comaProposals = projects.filter(
    p =>
      Boolean(activeUlbName) &&
      p.ulb === activeUlbName &&
      p.department?.toLowerCase().includes('coma')
  );

  const viewingFlowProposal = viewingFlowProposalId
    ? projects.find(p => p.id === viewingFlowProposalId) || null
    : null;

  // ============================================================================
  // SCREEN 1: Select between Municipality or Municipal Corporation
  // ============================================================================
  if (step === 'select_ulb_type') {
    return (
      <div className="min-h-screen w-full bg-[#F4F7FA] flex flex-col justify-between text-slate-900 font-sans select-none">
        {/* Official Government Top Header */}
        <header className="w-full bg-white border-b border-slate-200 shadow-2xs">
          <div className="bg-[#0b2b4d] text-slate-200 text-xs px-6 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBackToLanding}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-200 hover:text-white hover:bg-[#123e6b] transition-colors text-[11px] font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={onLock}
                title="Lock gate"
                className="p-1 rounded text-slate-300 hover:text-amber-300 hover:bg-[#123e6b] transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-300">{selectedDesignation || 'UDUHD official'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-semibold">
                {selectedDepartment || 'CoMA'} — Commissionerate of Municipal Administration
              </span>
            </div>
          </div>

          <div className="px-6 py-3 max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-sm sm:text-base font-bold text-[#0E355C] tracking-tight">
                Urban Development &amp; Urban Housing Department, Govt. of Gujarat
              </h1>
              <p className="text-xs text-slate-500">
                Commissionerate of Municipal Administration (CoMA)
              </p>
            </div>
          </div>
        </header>

        {/* Centered Selection Container */}
        <div className="w-full max-w-2xl mx-auto px-6 my-auto py-10">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            {/* Two Adjacent Options: Municipal Corporation vs Municipality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Municipal Corporation */}
              <button
                type="button"
                onClick={() => handleSelectUlbCategory('Municipal Corporation')}
                className={`w-full p-6 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  selectedUlbType === 'Municipal Corporation'
                    ? 'border-[#0E355C] bg-blue-50/50 ring-2 ring-[#0E355C]/15 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-4">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                      selectedUlbType === 'Municipal Corporation'
                        ? 'bg-[#0E355C] text-white'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedUlbType === 'Municipal Corporation'
                        ? 'border-[#0E355C] bg-[#0E355C] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedUlbType === 'Municipal Corporation' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0E355C]">
                    Municipal Corporation
                  </h3>
                  <p className="font-gujarati text-xs font-semibold text-amber-700 mt-0.5">
                    મહાનગરપાલિકા
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    17 Municipal Corporations across Gujarat metropolitan and urban jurisdictions
                  </p>
                </div>
              </button>

              {/* Option 2: Municipality */}
              <button
                type="button"
                onClick={() => handleSelectUlbCategory('Municipality')}
                className={`w-full p-6 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  selectedUlbType === 'Municipality'
                    ? 'border-[#0E355C] bg-blue-50/50 ring-2 ring-[#0E355C]/15 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-4">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                      selectedUlbType === 'Municipality'
                        ? 'bg-[#0E355C] text-white'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedUlbType === 'Municipality'
                        ? 'border-[#0E355C] bg-[#0E355C] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedUlbType === 'Municipality' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0E355C]">
                    Municipality
                  </h3>
                  <p className="font-gujarati text-xs font-semibold text-amber-700 mt-0.5">
                    નગરપાલિકા
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    157 Municipalities across Gujarat state under regional municipal administration
                  </p>
                </div>
              </button>
            </div>

            {/* Dropdown to select specific Municipal Corporation or Municipality on the same page */}
            {selectedUlbType && (
              <div ref={ulbDropdownRef} className="relative w-full mt-5">
                <label className="block text-xs font-bold text-[#0E355C] mb-1.5 pl-1">
                  Select {selectedUlbType}
                </label>
                <button
                  type="button"
                  onClick={() => setIsUlbDropdownOpen(!isUlbDropdownOpen)}
                  className={`w-full h-12 px-4 rounded-xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    isUlbDropdownOpen
                      ? 'border-[#0E355C] bg-blue-50/30 ring-2 ring-[#0E355C]/15 shadow-2xs'
                      : selectedUlbEntity
                      ? 'border-slate-300 bg-white text-slate-900 hover:border-[#0E355C]/60'
                      : 'border-slate-200 bg-slate-50/70 text-slate-500 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <span
                    className={`text-sm font-semibold truncate pr-2 ${
                      selectedUlbEntity ? 'text-[#0E355C]' : 'text-slate-400 font-normal'
                    }`}
                  >
                    {selectedUlbEntity || `Select ${selectedUlbType}`}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isUlbDropdownOpen ? 'rotate-180 text-[#0E355C]' : ''
                    }`}
                  />
                </button>

                {isUlbDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    <div className="p-1.5 space-y-0.5">
                      {ulbOptions.map(entity => {
                        const isSelected = selectedUlbEntity === entity.name;
                        return (
                          <button
                            key={entity.name}
                            type="button"
                            onClick={() => handleSelectUlbEntityFromDropdown(entity)}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 text-[#0E355C] font-bold'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <span className="truncate mr-2">{entity.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#0E355C] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Continue Button */}
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={handleContinueFromUlbSelection}
                disabled={!selectedUlbType || !selectedUlbEntity}
                className={`h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedUlbType && selectedUlbEntity
                    ? 'bg-[#0E355C] text-white hover:bg-[#092644] shadow-sm cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
          Urban Development &amp; Urban Housing Department, Government of Gujarat
        </footer>
      </div>
    );
  }

  // ============================================================================
  // SCREEN 2: Next Screen — Option to Register a Proposal
  // ============================================================================
  return (
    <div className="min-h-screen w-full bg-[#F4F7FA] flex flex-col justify-between text-slate-900 font-sans">
      {/* Official Government Top Header */}
      <header className="w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="bg-[#0b2b4d] text-slate-200 text-xs px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (showProposalForm) {
                  setShowProposalForm(false);
                } else {
                  setStep('select_ulb_type');
                  try {
                    sessionStorage.setItem('gudm_plms_coma_step', 'select_ulb_type');
                  } catch {
                    // ignore
                  }
                }
              }}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-200 hover:text-white hover:bg-[#123e6b] transition-colors text-[11px] font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>
                {showProposalForm ? 'Back to Proposal Options' : 'Back to ULB Selection'}
              </span>
            </button>
            <button
              type="button"
              onClick={onLock}
              title="Lock gate"
              className="p-1 rounded text-slate-300 hover:text-amber-300 hover:bg-[#123e6b] transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-300">{selectedDesignation || 'UDUHD official'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-200">CoMA</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300 font-semibold">{selectedUlbType}</span>
          </div>
        </div>

        <div className="px-6 py-3 max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#0E355C] tracking-tight">
              Urban Development &amp; Urban Housing Department, Govt. of Gujarat
            </h1>
            <p className="text-xs text-slate-500">
              Commissionerate of Municipal Administration (CoMA) · {selectedUlbType} Portal
            </p>
          </div>

          <button
            type="button"
            onClick={onProceedToDashboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-[#0E355C] hover:bg-blue-50 hover:border-blue-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Main Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-3xl mx-auto px-6 my-auto py-8">
        {viewingFlowProposal ? (
          <ProposalLifecycleFlowView
            project={viewingFlowProposal}
            currentStepIndex={proposalStageMap[viewingFlowProposal.id] ?? 1}
            onAdvanceStage={nextIdx =>
              setProposalStageMap(prev => ({
                ...prev,
                [viewingFlowProposal.id]: nextIdx
              }))
            }
            onBack={() => setViewingFlowProposalId(null)}
            onOpenFullDashboard={() => {
              setSelectedProjectId(viewingFlowProposal.id);
              onProceedToDashboard();
            }}
          />
        ) : !showProposalForm ? (
          <div className="space-y-6">
            {/* Success Banner if a proposal was just registered */}
            {lastCreatedProposalId && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">
                      Proposal Registered Successfully ({lastCreatedProposalId})
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Click to view and advance the 29-stage project lifecycle workflow.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingFlowProposalId(lastCreatedProposalId)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer"
                >
                  View Lifecycle Flow &rarr;
                </button>
              </div>
            )}

            {/* Minimal Municipal Actions Grid */}
            <UlbRoutineOperationsPanel
              ulbName={activeUlbName}
              ulbType={selectedUlbType}
              district={proposalForm.district}
              registeredProposalsCount={comaProposals.length}
              onOpenRegisterProposal={() => setShowProposalForm(true)}
            />

            {/* Recent Proposals List (Only for the selected Municipal Corporation / Municipality) */}
            {comaProposals.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0E355C]">
                    Registered Proposals ({comaProposals.length})
                  </span>
                  <button
                    type="button"
                    onClick={onProceedToDashboard}
                    className="text-xs font-semibold text-blue-800 hover:underline transition-colors cursor-pointer"
                  >
                    Open Full Registry &rarr;
                  </button>
                </div>
                <div className="divide-y divide-slate-200 max-h-60 overflow-y-auto">
                  {comaProposals.slice(0, 5).map(proj => {
                    const stepIdx = proposalStageMap[proj.id] ?? 1;
                    const stageLabel =
                      stepIdx >= PROPOSAL_LIFECYCLE_STAGES.length
                        ? 'Project Handover Completed'
                        : PROPOSAL_LIFECYCLE_STAGES[stepIdx]?.title || proj.currentStage;
                    return (
                      <div
                        key={proj.id}
                        onClick={() => setViewingFlowProposalId(proj.id)}
                        className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-blue-50/40 transition-colors cursor-pointer text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{proj.name}</div>
                          <div className="text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span className="font-mono font-semibold text-[#0E355C]">{proj.id}</span>
                            <span aria-hidden="true">·</span>
                            <span>{proj.ulb}</span>
                            <span aria-hidden="true">·</span>
                            <span>{proj.category}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-slate-900">
                            ₹ {(Number(proj.estimatedCost) || 0).toFixed(1)} Cr
                          </div>
                          <div className="text-[11px] font-medium text-[#0E355C]">
                            {stageLabel} &rarr;
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Proposal Registration Form */
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <p className="text-xs text-[#0E355C] font-semibold">
                CoMA · {selectedUlbType} Proposal Registration
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Register New Infrastructure Proposal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter scheme details to generate a Proposal ID and initiate CoMA administrative approval
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Select {selectedUlbType} <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={proposalForm.ulbName}
                    onChange={e => handleUlbEntityChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0E355C]"
                  >
                    {ulbOptions.map(u => (
                      <option key={u.name} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">District</label>
                  <input
                    type="text"
                    value={proposalForm.district}
                    onChange={e =>
                      setProposalForm({ ...proposalForm, district: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0E355C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Proposal / Scheme Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g., ${proposalForm.ulbName} 24x7 Water Supply & Underground Sewerage Augmentation`}
                  value={proposalForm.title}
                  onChange={e => setProposalForm({ ...proposalForm, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E355C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Sector / Category
                  </label>
                  <select
                    value={proposalForm.category}
                    onChange={e =>
                      setProposalForm({
                        ...proposalForm,
                        category: e.target.value as ProjectCategory
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0E355C]"
                  >
                    <option value="Water Supply & Sewerage">Water Supply &amp; Sewerage</option>
                    <option value="Stormwater Drainage">Stormwater Drainage</option>
                    <option value="Urban Roads & Bridges">Urban Roads &amp; Bridges</option>
                    <option value="Solid Waste Management">Solid Waste Management</option>
                    <option value="Urban Transport & EV">Urban Transport &amp; EV</option>
                    <option value="Lake Rejuvenation & Green Space">
                      Lake Rejuvenation &amp; Green Space
                    </option>
                    <option value="Smart City & Digital Infra">
                      Smart City &amp; Digital Infra
                    </option>
                    <option value="Affordable Housing & Slum Upgradation">
                      Affordable Housing &amp; Slum Upgradation
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Infrastructure Type
                  </label>
                  <select
                    value={proposalForm.infrastructureType}
                    onChange={e =>
                      setProposalForm({
                        ...proposalForm,
                        infrastructureType: e.target.value as any
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0E355C]"
                  >
                    <option value="Greenfield Infrastructure">Greenfield Infrastructure</option>
                    <option value="Capacity Expansion">Capacity Expansion</option>
                    <option value="Modernization">Modernization</option>
                    <option value="Brownfield Augmentation">Brownfield Augmentation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Estimated Cost (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="Enter estimated cost"
                    value={proposalForm.estimatedCost}
                    onChange={e =>
                      setProposalForm({ ...proposalForm, estimatedCost: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#0E355C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Funding Mission / Grant Scheme
                  </label>
                  <select
                    value={proposalForm.fundingSource}
                    onChange={e =>
                      setProposalForm({
                        ...proposalForm,
                        fundingSource: e.target.value as FundingSource
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0E355C]"
                  >
                    <option value="Swarnim Jayanti Mukhya Mantri Shehri Vikas Yojana (SJMMSVY)">
                      Swarnim Jayanti Mukhya Mantri Shehri Vikas Yojana (SJMMSVY)
                    </option>
                    <option value="AMRUT 2.0">AMRUT 2.0</option>
                    <option value="Smart Cities Mission">Smart Cities Mission</option>
                    <option value="World Bank / GUDM Urban Resilient Fund">
                      World Bank / GUDM Urban Resilient Fund
                    </option>
                    <option value="State Budget Grant">State Budget Grant</option>
                    <option value="ULB Own Fund / Municipal Bonds">
                      ULB Own Fund / Municipal Bonds
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Site / Ward Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ward 4 & 7 Municipal Zone"
                    value={proposalForm.location}
                    onChange={e =>
                      setProposalForm({ ...proposalForm, location: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E355C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Proposed Start Date
                  </label>
                  <input
                    type="date"
                    value={proposalForm.plannedStartDate}
                    onChange={e =>
                      setProposalForm({ ...proposalForm, plannedStartDate: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0E355C]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Expected Completion Date
                  </label>
                  <input
                    type="date"
                    value={proposalForm.plannedCompletionDate}
                    onChange={e =>
                      setProposalForm({
                        ...proposalForm,
                        plannedCompletionDate: e.target.value
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0E355C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Proposal Scope &amp; Justification
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe project objectives, target population benefited, and key technical components..."
                  value={proposalForm.description}
                  onChange={e =>
                    setProposalForm({ ...proposalForm, description: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E355C]"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProposalForm(false)}
                  className="h-10 px-4 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#0E355C] text-white hover:bg-[#092644] font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Submit &amp; Register Proposal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        Commissionerate of Municipal Administration (CoMA) · Urban Development &amp; Urban Housing Department, Govt. of Gujarat
      </footer>
    </div>
  );
};
