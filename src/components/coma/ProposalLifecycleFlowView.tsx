import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Check,
  Flag
} from 'lucide-react';
import { StageSoftCopyModal } from './StageSoftCopyModal';

export interface ProposalProjectSummary {
  id: string;
  name: string;
  ulb: string;
  category: string;
  estimatedCost: number;
}

export interface ProposalFlowStage {
  stepNumber: number;
  title: string;
  phase:
    | 'Survey & DPR'
    | 'Scrutiny & Approvals'
    | 'Tendering & Award'
    | 'Execution & Billing'
    | 'Closure & Handover';
  authority: string;
}

export const PROPOSAL_LIFECYCLE_STAGES: ProposalFlowStage[] = [
  {
    stepNumber: 1,
    title: 'Proposal Submission',
    phase: 'Survey & DPR',
    authority: 'ULB Nodal Officer'
  },
  {
    stepNumber: 2,
    title: 'Preliminary Survey',
    phase: 'Survey & DPR',
    authority: 'ULB Field Engineering'
  },
  {
    stepNumber: 3,
    title: 'Feasibility Study',
    phase: 'Survey & DPR',
    authority: 'Technical Consultant'
  },
  {
    stepNumber: 4,
    title: 'DPR Preparation',
    phase: 'Survey & DPR',
    authority: 'Project Cell'
  },
  {
    stepNumber: 5,
    title: 'DPR Verification',
    phase: 'Survey & DPR',
    authority: 'Executive Engineer'
  },
  {
    stepNumber: 6,
    title: 'Technical Scrutiny',
    phase: 'Scrutiny & Approvals',
    authority: 'Superintending Engineer'
  },
  {
    stepNumber: 7,
    title: 'Cost Estimation',
    phase: 'Scrutiny & Approvals',
    authority: 'SOR & Estimation Wing'
  },
  {
    stepNumber: 8,
    title: 'Commissioner Approval',
    phase: 'Scrutiny & Approvals',
    authority: 'Municipal Commissioner / CO'
  },
  {
    stepNumber: 9,
    title: 'Standing Committee Approval',
    phase: 'Scrutiny & Approvals',
    authority: 'Standing Committee'
  },
  {
    stepNumber: 10,
    title: 'Technical Sanction',
    phase: 'Scrutiny & Approvals',
    authority: 'Chief Engineer / CoMA'
  },
  {
    stepNumber: 11,
    title: 'Tender Document Preparation',
    phase: 'Tendering & Award',
    authority: 'Procurement & Tender Cell'
  },
  {
    stepNumber: 12,
    title: 'e-Procurement Publication',
    phase: 'Tendering & Award',
    authority: 'nProcure Portal Officer'
  },
  {
    stepNumber: 13,
    title: 'Technical Evaluation',
    phase: 'Tendering & Award',
    authority: 'Tender Evaluation Committee'
  },
  {
    stepNumber: 14,
    title: 'Financial Evaluation',
    phase: 'Tendering & Award',
    authority: 'Finance & Accounts / TEC'
  },
  {
    stepNumber: 15,
    title: 'LOI Issuance',
    phase: 'Tendering & Award',
    authority: 'Municipal Commissioner / CO'
  },
  {
    stepNumber: 16,
    title: 'Performance Bank Guarantee Submission',
    phase: 'Tendering & Award',
    authority: 'Contractor / Accounts'
  },
  {
    stepNumber: 17,
    title: 'Agreement Signing',
    phase: 'Tendering & Award',
    authority: 'ULB Authority & Contractor'
  },
  {
    stepNumber: 18,
    title: 'Site Handover',
    phase: 'Execution & Billing',
    authority: 'Site Engineer & Ward Officer'
  },
  {
    stepNumber: 19,
    title: 'Design Approval',
    phase: 'Execution & Billing',
    authority: 'PMC & Executive Engineer'
  },
  {
    stepNumber: 20,
    title: 'Construction Execution',
    phase: 'Execution & Billing',
    authority: 'EPC Contractor & Field Team'
  },
  {
    stepNumber: 21,
    title: 'RFI Submission',
    phase: 'Execution & Billing',
    authority: 'Contractor Quality Engineer'
  },
  {
    stepNumber: 22,
    title: 'Site Inspection',
    phase: 'Execution & Billing',
    authority: 'PMC & ULB Site Engineer'
  },
  {
    stepNumber: 23,
    title: 'Contractor RA Bill Submission',
    phase: 'Execution & Billing',
    authority: 'Contractor Billing Section'
  },
  {
    stepNumber: 24,
    title: 'Site Verification Check',
    phase: 'Execution & Billing',
    authority: 'Dy. Executive Engineer (MB)'
  },
  {
    stepNumber: 25,
    title: 'PMC Bill Verification & Payment Request',
    phase: 'Execution & Billing',
    authority: 'PMC Billing Team'
  },
  {
    stepNumber: 26,
    title: 'Contractor Payment',
    phase: 'Execution & Billing',
    authority: 'Chief Accountant / Treasury'
  },
  {
    stepNumber: 27,
    title: 'Final Site Inspection',
    phase: 'Closure & Handover',
    authority: 'Joint Inspection Team'
  },
  {
    stepNumber: 28,
    title: 'Project Completion Certificate',
    phase: 'Closure & Handover',
    authority: 'Chief Engineer / Commissioner'
  },
  {
    stepNumber: 29,
    title: 'Project Handover',
    phase: 'Closure & Handover',
    authority: 'O&M Wing / Asset Cell'
  }
];

interface ProposalLifecycleFlowViewProps {
  project: ProposalProjectSummary;
  currentStepIndex: number; // 0-indexed (0 = Stage 1 active, 1 = Stage 1 completed & Stage 2 active)
  onAdvanceStage: (nextStepIndex: number) => void;
  onBack: () => void;
  onOpenFullDashboard: () => void;
}

export const ProposalLifecycleFlowView: React.FC<ProposalLifecycleFlowViewProps> = ({
  project,
  currentStepIndex,
  onAdvanceStage,
  onBack
}) => {
  const [selectedStageForFile, setSelectedStageForFile] = useState<ProposalFlowStage | null>(
    null
  );
  const totalSteps = PROPOSAL_LIFECYCLE_STAGES.length;
  const activeStage = PROPOSAL_LIFECYCLE_STAGES[Math.min(currentStepIndex, totalSteps - 1)];
  const isAllCompleted = currentStepIndex >= totalSteps;

  // Group stages into 5 serpentine flow tracks (6, 6, 6, 6, 5 + Finish node)
  const COLS = 6;
  const rows: ProposalFlowStage[][] = [];
  for (let i = 0; i < totalSteps; i += COLS) {
    rows.push(PROPOSAL_LIFECYCLE_STAGES.slice(i, i + COLS));
  }

  return (
    <div className="space-y-2.5">
      {/* Sleek Single-Row Proposal Bar */}
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-2.5 shadow-2xs flex items-center justify-between gap-4">
        {/* Left: Proposal Name & Sleek Essential Details */}
        <div className="min-w-0 flex items-baseline gap-3 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-[#0E355C] tracking-tight truncate">
            {project.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{project.ulb}</span>
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-slate-800">
              ₹ {(Number(project.estimatedCost) || 0).toFixed(2)} Cr
            </span>
          </div>
        </div>

        {/* Right: Sleek Stage Action + Compact Back Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!isAllCompleted && (
            <button
              type="button"
              onClick={() => onAdvanceStage(currentStepIndex + 1)}
              className="h-8 px-3.5 rounded-lg bg-[#0E355C] text-white hover:bg-[#092644] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: {activeStage.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="h-7 px-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-600 hover:text-[#0E355C] transition-colors inline-flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Single-Screen Continuous Serpentine Process Pipeline (29 Stages) */}
      <div className="bg-white rounded-xl border border-slate-200 px-8 py-4 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-3.5 pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Project Lifecycle Flow
          </h3>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Done
            </span>
            <span className="inline-flex items-center gap-1 text-[#0E355C] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0E355C] inline-block" /> Active
            </span>
            <span className="font-mono font-bold text-[#0E355C] bg-slate-100 px-2 py-0.5 rounded text-[10.5px]">
              {Math.min(currentStepIndex, totalSteps)} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Continuous Winding S-Curve Pipeline */}
        <div className="space-y-5 relative py-1">
          {rows.map((rowStages, rowIdx) => {
            const isReversed = rowIdx % 2 === 1;
            // In odd rows, flow travels Right -> Left so we reverse the visual order of the stages
            const orderedStages = isReversed ? [...rowStages].reverse() : rowStages;
            const lastStageInRow = rowStages[rowStages.length - 1];
            const isRowTurnCompleted = lastStageInRow.stepNumber - 1 < currentStepIndex;

            return (
              <div key={rowIdx} className="relative flex items-center h-13">
                {/* Continuous Curved Side U-Turn Pipe Connecting This Row to Next Row */}
                {rowIdx < rows.length - 1 && (
                  <div
                    className={`absolute top-1/2 h-[calc(100%+1.25rem)] w-6 pointer-events-none z-0 ${
                      isReversed
                        ? '-left-5 rounded-l-2xl border-l-[3px] border-t-[3px] border-b-[3px]'
                        : '-right-5 rounded-r-2xl border-r-[3px] border-t-[3px] border-b-[3px]'
                    } ${
                      isRowTurnCompleted ? 'border-emerald-500' : 'border-slate-300'
                    }`}
                  >
                    {/* Downward Direction Badge on the U-Turn Curve */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow-2xs ${
                        isReversed ? '-left-2.5' : '-right-2.5'
                      } ${
                        isRowTurnCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-500'
                      }`}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </div>
                  </div>
                )}

                {/* Horizontal Pipeline Row of Connected Pill Nodes & Long Arrow Shafts */}
                <div className="w-full flex items-center justify-between relative z-10">
                  {orderedStages.map((stage, idx) => {
                    const stageIdx = stage.stepNumber - 1;
                    const isCompleted = stageIdx < currentStepIndex;
                    const isCurrent = stageIdx === currentStepIndex && !isAllCompleted;

                    // Determine if there is another node to the right in this row
                    const hasRightNode = idx < orderedStages.length - 1;
                    // For Left->Right rows, the connector to the right is completed when `stageIdx < currentStepIndex`
                    // For Right->Left rows, the connector to the right comes FROM `stageIdx - 1`, so it is completed when `stageIdx - 1 < currentStepIndex`
                    const isRightConnectorDone = isReversed
                      ? stageIdx - 1 < currentStepIndex
                      : stageIdx < currentStepIndex;

                    return (
                      <React.Fragment key={stage.stepNumber}>
                        {/* Pill-Shaped Flowchart Stage Node */}
                        <div
                          onClick={() => setSelectedStageForFile(stage)}
                          title={`Click to open ${stage.title} soft copy (${stage.authority})`}
                          className={`flex-1 min-w-0 h-12 px-2.5 rounded-full border-2 transition-all cursor-pointer flex items-center gap-2 select-none ${
                            isCurrent
                              ? 'border-[#0E355C] bg-blue-50 shadow-xs ring-3 ring-[#0E355C]/15'
                              : isCompleted
                              ? 'border-emerald-500 bg-emerald-50/70 hover:bg-emerald-50'
                              : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/60'
                          }`}
                        >
                          {/* Circular Step Badge */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10.5px] font-bold shrink-0 shadow-2xs ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-[#0E355C] text-white'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              String(stage.stepNumber).padStart(2, '0')
                            )}
                          </div>

                          {/* Stage Title */}
                          <div className="min-w-0 flex-1 pr-1">
                            <div
                              className={`text-[10.5px] font-bold leading-tight line-clamp-2 ${
                                isCurrent
                                  ? 'text-[#0E355C]'
                                  : isCompleted
                                  ? 'text-emerald-950'
                                  : 'text-slate-700'
                              }`}
                            >
                              {stage.title}
                            </div>
                          </div>
                        </div>

                        {/* Prominent Horizontal Flow Pipe + Directional Arrow Between Nodes */}
                        {hasRightNode && (
                          <div className="w-6 sm:w-8 shrink-0 flex items-center justify-center relative">
                            <div
                              className={`w-full h-[3px] ${
                                isRightConnectorDone ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                            />
                            <div
                              className={`absolute inset-0 flex items-center justify-center ${
                                isRightConnectorDone ? 'text-emerald-600' : 'text-slate-400'
                              }`}
                            >
                              {isReversed ? (
                                <ArrowLeft className="w-3.5 h-3.5 bg-white rounded-full" />
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* On the Final Row (5 stages: 25..29), add the Connected Finish / Handover Terminal Node so the flow completes cleanly */}
                  {rowIdx === rows.length - 1 && (
                    <>
                      <div className="w-6 sm:w-8 shrink-0 flex items-center justify-center relative">
                        <div
                          className={`w-full h-[3px] ${
                            isAllCompleted ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                        <div
                          className={`absolute inset-0 flex items-center justify-center ${
                            isAllCompleted ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          <ArrowRight className="w-3.5 h-3.5 bg-white rounded-full" />
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          setSelectedStageForFile(
                            PROPOSAL_LIFECYCLE_STAGES[PROPOSAL_LIFECYCLE_STAGES.length - 1]
                          )
                        }
                        title="Click to open Final Handover & Commissioning Dossier"
                        className={`flex-1 min-w-0 h-12 px-3 rounded-full border-2 flex items-center gap-2 cursor-pointer transition-all ${
                          isAllCompleted
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                            : 'border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            isAllCompleted
                              ? 'bg-white text-emerald-700'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isAllCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Flag className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider leading-tight">
                            {isAllCompleted ? 'Lifecycle Complete' : 'Finish Line'}
                          </div>
                          <div className="text-[10px] opacity-85 truncate">
                            Asset Commissioned
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Official Soft Copy Document Modal */}
      {selectedStageForFile && (
        <StageSoftCopyModal
          stage={selectedStageForFile}
          project={project}
          isCompleted={selectedStageForFile.stepNumber - 1 < currentStepIndex}
          isCurrent={
            selectedStageForFile.stepNumber - 1 === currentStepIndex && !isAllCompleted
          }
          onClose={() => setSelectedStageForFile(null)}
          onMarkComplete={() => {
            onAdvanceStage(selectedStageForFile.stepNumber);
            setSelectedStageForFile(null);
          }}
        />
      )}
    </div>
  );
};
