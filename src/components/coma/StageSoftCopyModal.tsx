import React from 'react';
import {
  X,
  Download,
  CheckCircle2
} from 'lucide-react';
import { ProposalFlowStage, ProposalProjectSummary } from './ProposalLifecycleFlowView';
import { StageDistinctBody } from './StageDistinctRenderers';

interface StageSoftCopyModalProps {
  stage: ProposalFlowStage;
  project: ProposalProjectSummary;
  isCompleted: boolean;
  isCurrent: boolean;
  onClose: () => void;
  onMarkComplete: () => void;
}

interface StageDocumentContent {
  fileName: string;
  docCode: string;
  docTitle: string;
  docSubtitle: string;
  date: string;
  summaryParagraph: string;
  keyMetrics: { label: string; value: string }[];
  tableHeaders: string[];
  tableRows: string[][];
  certificationNote: string;
  signatoryTitle: string;
  countersignTitle: string;
}

function getStageDocumentContent(
  stage: ProposalFlowStage,
  project: ProposalProjectSummary
): StageDocumentContent {
  const cost = Number(project.estimatedCost) || 25.0;
  const civilCost = (cost * 0.72).toFixed(2);
  const mepCost = (cost * 0.16).toFixed(2);
  const contingencyCost = (cost * 0.04).toFixed(2);
  const gstCost = (cost * 0.08).toFixed(2);
  const l1Cost = (cost * 0.965).toFixed(2);
  const pbgAmount = (cost * 0.965 * 0.05).toFixed(2);
  const raBillAmount = (cost * 0.28).toFixed(2);
  const netRaPayable = (cost * 0.28 * 0.9).toFixed(2);

  const slug = stage.title.replace(/[^a-zA-Z0-9]+/g, '_');
  const paddedStep = String(stage.stepNumber).padStart(2, '0');
  const fileName = `${paddedStep}_${slug}_${project.id}.pdf`;
  const docCode = `GoG/UDUHD/CoMA/${project.id}/STG-${paddedStep}`;

  switch (stage.stepNumber) {
    case 1:
      return {
        fileName,
        docCode,
        docTitle: 'FORM-A: MUNICIPAL INFRASTRUCTURE PROPOSAL SUBMISSION',
        docSubtitle: 'Initial Scheme Registration & Administrative Proposal Soft Copy',
        date: '12 Apr 2026',
        summaryParagraph: `Official proposal submitted by ${project.ulb} under the Commissionerate of Municipal Administration (CoMA) for "${project.name}" under the ${project.category || 'Urban Infrastructure'} sector at an estimated outlay of ₹ ${cost.toFixed(2)} Cr.`,
        keyMetrics: [
          { label: 'Proposal ID', value: project.id },
          { label: 'Urban Local Body', value: project.ulb },
          { label: 'Sector Category', value: project.category || 'Civic Infrastructure' },
          { label: 'Proposed Outlay', value: `₹ ${cost.toFixed(2)} Cr` }
        ],
        tableHeaders: ['Sr.', 'Proposal Parameter', 'Submitted Specification', 'Verification'],
        tableRows: [
          ['01', 'Scheme Title', project.name, 'Verified'],
          ['02', 'Implementing ULB', project.ulb, 'Confirmed'],
          ['03', 'Target Service Coverage', 'Municipal Ward Zone Citizens & Civic Grid', 'Assessed'],
          ['04', 'Preliminary Capital Cost', `₹ ${cost.toFixed(2)} Crore`, 'Submitted']
        ],
        certificationNote:
          'Certified that this municipal infrastructure proposal aligns with the approved Annual Development Plan of the ULB and contains no duplication with other central/state grants.',
        signatoryTitle: 'ULB Nodal Officer / Municipal Engineer',
        countersignTitle: 'Chief Officer / Dy. Municipal Commissioner'
      };

    case 2:
      return {
        fileName,
        docCode,
        docTitle: 'PRELIMINARY TOPOGRAPHICAL & SITE RECONNAISSANCE SURVEY REPORT',
        docSubtitle: 'Field Engineering DGPS & Utility Mapping Soft Copy',
        date: '19 Apr 2026',
        summaryParagraph: `Field reconnaissance, DGPS boundary survey, and existing underground utility mapping conducted across the proposed project site for "${project.name}" within ${project.ulb} municipal limits.`,
        keyMetrics: [
          { label: 'Survey Method', value: 'Dual-Frequency DGPS & Total Station' },
          { label: 'Land Status', value: '100% Municipal Possession (Encumbrance-Free)' },
          { label: 'Soil Strata', value: 'Medium Dense Alluvial / Murrum Strata' },
          { label: 'Utility Clearance', value: 'Water, UGD & Power Lines Mapped' }
        ],
        tableHeaders: ['Chainage / Zone', 'Field Activity', 'Benchmark / Observation', 'Status'],
        tableRows: [
          ['Zone-A (Start)', 'Permanent Benchmark (TBM-01)', 'RL +84.420m MSL Established', 'Completed'],
          ['Zone-B (Mid)', 'Topographical Contour Grid', '10m x 10m Cross-Section Plotted', 'Completed'],
          ['Zone-C (End)', 'Trial Pit & Sub-soil Check', 'Safe Bearing Capacity ~18.5 T/m²', 'Verified'],
          ['Full Corridor', 'ROW & Encumbrance Check', 'Clear Municipal Right-of-Way Available', 'Cleared']
        ],
        certificationNote:
          'Field survey traverse closed within permissible accuracy limits. Site plans and L-sections forwarded for Feasibility & DPR preparation.',
        signatoryTitle: 'Assistant Engineer (Field Survey)',
        countersignTitle: 'Executive Engineer, ULB Engineering Cell'
      };

    case 3:
      return {
        fileName,
        docCode,
        docTitle: 'TECHNO-ECONOMIC FEASIBILITY STUDY REPORT (TEFR)',
        docSubtitle: 'Engineering Viability, Demand Projection & Environmental Screening',
        date: '28 Apr 2026',
        summaryParagraph: `Comprehensive Techno-Economic Feasibility Study evaluating engineering alternatives, 30-year design horizon demand projections, and lifecycle O&M sustainability for "${project.name}" (${project.ulb}).`,
        keyMetrics: [
          { label: 'Design Horizon', value: '30 Years (2026 – 2056)' },
          { label: 'Economic IRR (EIRR)', value: '14.8% (Viable > 12% Benchmark)' },
          { label: 'Environmental Category', value: 'Category-B2 (Benign Civic Work)' },
          { label: 'Selected Option', value: 'Option-II: Energy-Efficient Modular Design' }
        ],
        tableHeaders: ['Evaluation Parameter', 'Option-I (Conventional)', 'Option-II (Recommended)', 'Remarks'],
        tableRows: [
          ['Capital Cost', `₹ ${(cost * 1.08).toFixed(2)} Cr`, `₹ ${cost.toFixed(2)} Cr`, '7.4% Capex Saving'],
          ['Annual O&M Cost', `₹ ${(cost * 0.045).toFixed(2)} Cr/yr`, `₹ ${(cost * 0.028).toFixed(2)} Cr/yr`, 'Low Lifecycle Cost'],
          ['Construction Duration', '24 Months', '18 Months', 'Faster Commissioning'],
          ['Technical Reliability', 'Standard', 'High (IS / CPHEEO Compliant)', 'Recommended']
        ],
        certificationNote:
          'Based on techno-economic appraisal, the proposed scheme is technically feasible and financially sustainable for implementation.',
        signatoryTitle: 'Empanelled Technical Consultant',
        countersignTitle: 'Project Planning Cell, ULB'
      };

    case 4:
      return {
        fileName,
        docCode,
        docTitle: 'DETAILED PROJECT REPORT (DPR) — SOFT COPY',
        docSubtitle: 'Volume-I: Executive Summary, Detailed Engineering Designs, Drawings & Abstract BoQ',
        date: '08 May 2026',
        summaryParagraph: `Complete Detailed Project Report (DPR) prepared for "${project.name}" at ${project.ulb}, comprising hydraulic/structural design calculations, GFC-ready layout drawings, and itemized Bill of Quantities based on latest Gujarat GWSSB / R&B Schedule of Rates.`,
        keyMetrics: [
          { label: 'DPR Volume Set', value: 'Vol I (Report), Vol II (BoQ), Vol III (Drawings)' },
          { label: 'SOR Reference', value: 'Gujarat R&B / GWSSB SOR 2025-26' },
          { label: 'Total DPR Cost', value: `₹ ${cost.toFixed(2)} Crore` },
          { label: 'Implementation Period', value: '18 Months (+ 5 Yrs DLP)' }
        ],
        tableHeaders: ['Sub-Head Code', 'DPR Work Component Description', 'Estimated Cost (₹ Cr)', '% Share'],
        tableRows: [
          ['PART-A', 'Core Civil & Structural Infrastructure Works', `₹ ${civilCost} Cr`, '72.0%'],
          ['PART-B', 'Electro-Mechanical, Instrumentation & Allied Works', `₹ ${mepCost} Cr`, '16.0%'],
          ['PART-C', 'Quality Control, TPI & Physical Contingencies', `₹ ${contingencyCost} Cr`, '4.0%'],
          ['PART-D', 'Statutory GST & Labour Welfare Cess Provision', `₹ ${gstCost} Cr`, '8.0%'],
          ['TOTAL', 'Grand Total DPR Project Cost', `₹ ${cost.toFixed(2)} Cr`, '100.0%']
        ],
        certificationNote:
          'Certified that the Detailed Project Report (DPR) has been prepared strictly in accordance with CPHEEO / IRC / NBC standards and current Schedule of Rates.',
        signatoryTitle: 'Nodal Engineer, DPR Project Cell',
        countersignTitle: 'Executive Engineer, ' + project.ulb
      };

    case 5:
      return {
        fileName,
        docCode,
        docTitle: 'DPR FIELD & TECHNICAL VERIFICATION CERTIFICATE',
        docSubtitle: 'Executive Engineer Verification of DPR Volumes, Drawings & Site Levels',
        date: '14 May 2026',
        summaryParagraph: `Verification of all DPR volumes, site levels, design assumptions, and rate analyses for "${project.name}" (${project.ulb}) prior to submission for Superintending Engineer Technical Scrutiny.`,
        keyMetrics: [
          { label: 'DPR Check Status', value: '100% Cross-Verified with Site Levels' },
          { label: 'Drawings Verified', value: '14 Sheets (Layout, Sections & GA)' },
          { label: 'Land Availability', value: 'Verified Free of Encroachment' },
          { label: 'SOR Rate Check', value: 'Matched with Current Sanctioned SOR' }
        ],
        tableHeaders: ['Checklist Item', 'DPR Document Component', 'VerificationFinding', 'Status'],
        tableRows: [
          ['CHK-01', 'Design Basis & Engineering Calculations', 'Checked & Found In Order', 'Verified'],
          ['CHK-02', 'Geotechnical & Soil Investigation Report', 'Borelog Data Incorporated', 'Verified'],
          ['CHK-03', 'Take-off Quantities & Measurement Sheets', 'Arithmetically Checked', 'Verified'],
          ['CHK-04', 'Site Layout & Structural GA Drawings', 'Signed & Stamped', 'Verified']
        ],
        certificationNote:
          'All quantities, drawings, and technical provisions in the DPR have been verified on site and found accurate.',
        signatoryTitle: 'Deputy Executive Engineer',
        countersignTitle: 'Executive Engineer, ' + project.ulb
      };

    case 6:
      return {
        fileName,
        docCode,
        docTitle: 'SUPERINTENDING ENGINEER TECHNICAL SCRUTINY NOTE',
        docSubtitle: 'Detailed Engineering Appraisal & IS-Code Compliance Vetting Sheet',
        date: '21 May 2026',
        summaryParagraph: `Technical scrutiny and structural/hydraulic vetting note for "${project.name}" at ${project.ulb}, confirming compliance with relevant Bureau of Indian Standards (BIS) codes and state urban engineering manuals.`,
        keyMetrics: [
          { label: 'Scrutiny Authority', value: 'Superintending Engineer Circle' },
          { label: 'BIS Code Compliance', value: 'IS:456, IS:3370 & NBC 2016 Compliant' },
          { label: 'Scrutiny Queries', value: '04 Raised / 04 Complied' },
          { label: 'Appraisal Result', value: 'Recommended for Cost & Admin Sanction' }
        ],
        tableHeaders: ['Scrutiny Aspect', 'Standard / Code Applied', 'Compliance Note', 'Clearance'],
        tableRows: [
          ['Structural Safety', 'IS:456:2000 & IS:1893 (Zone-III)', 'Seismic Factor Incorporated', 'Cleared'],
          ['Material Specs', 'Grade M30 RCC & Fe500D TMT', 'Specified in BoQ Items', 'Cleared'],
          ['Safety & QA/QC', '3-Tier Quality Assurance Plan', 'Mandatory Lab & TPI Tests Added', 'Cleared'],
          ['O&M Provision', '5-Year Defect Liability Period', 'Included in Scope', 'Cleared']
        ],
        certificationNote:
          'The DPR and engineering designs have undergone technical scrutiny and are cleared for final cost estimation and administrative sanction.',
        signatoryTitle: 'Technical Cell Appraisal Officer',
        countersignTitle: 'Superintending Engineer (CoMA / Circle)'
      };

    case 7:
      return {
        fileName,
        docCode,
        docTitle: 'DETAILED SOR COST ESTIMATION & RATE ANALYSIS SHEET',
        docSubtitle: 'Sanctioned Schedule of Rates (SOR) Abstract & Lead/Lift Statement',
        date: '26 May 2026',
        summaryParagraph: `Finalized Cost Estimation and Rate Analysis sheet for "${project.name}" (${project.ulb}), vetted by the SOR & Estimation Wing for an aggregate estimated cost of ₹ ${cost.toFixed(2)} Cr.`,
        keyMetrics: [
          { label: 'Base SOR Year', value: 'FY 2025-26 Gujarat SOR' },
          { label: 'Non-SOR Items', value: 'Nil (100% Covered by Sanctioned SOR)' },
          { label: 'Net Base Estimate', value: `₹ ${(cost * 0.88).toFixed(2)} Cr` },
          { label: 'Gross Sanctionable Cost', value: `₹ ${cost.toFixed(2)} Cr` }
        ],
        tableHeaders: ['Item Group', 'SOR Item Ref', 'Evaluated Amount (₹ Cr)', 'Vetting Status'],
        tableRows: [
          ['Earthwork & Substructure', 'SOR Ch-02 / 04', `₹ ${(cost * 0.22).toFixed(2)} Cr`, 'Rate Vetted'],
          ['RCC & Main Civil Works', 'SOR Ch-05 / 07', `₹ ${(cost * 0.50).toFixed(2)} Cr`, 'Rate Vetted'],
          ['Allied & Finishing Works', 'SOR Ch-11 / 14', `₹ ${(cost * 0.16).toFixed(2)} Cr`, 'Rate Vetted'],
          ['GST, Cess & Contingencies', 'Statutory Norms', `₹ ${(cost * 0.12).toFixed(2)} Cr`, 'Verified']
        ],
        certificationNote:
          'Rates, lead statements, and mathematical extensions have been checked by the Estimation Wing and found correct.',
        signatoryTitle: 'Divisional Accountant / Estimator',
        countersignTitle: 'Executive Engineer (SOR & Estimation Wing)'
      };

    case 8:
      return {
        fileName,
        docCode,
        docTitle: 'MUNICIPAL COMMISSIONER ADMINISTRATIVE APPROVAL ORDER',
        docSubtitle: 'Office Note (Green Sheet) & Administrative Concurrence Soft Copy',
        date: '02 Jun 2026',
        summaryParagraph: `Administrative Approval accorded by the Municipal Commissioner / Chief Officer of ${project.ulb} for "${project.name}" at an estimated cost of ₹ ${cost.toFixed(2)} Cr, authorizing submission to the Standing Committee.`,
        keyMetrics: [
          { label: 'Approval Order No.', value: `MC/AA/2026/${project.id.slice(-3)}` },
          { label: 'Financial Concurrence', value: 'Endorsed by Chief Accountant' },
          { label: 'Approved Outlay', value: `₹ ${cost.toFixed(2)} Cr` },
          { label: 'Grant Scheme', value: 'SJMMSVY / State Urban Grant' }
        ],
        tableHeaders: ['File Stage', 'Reviewing Authority', 'Endorsement Remarks', 'Decision'],
        tableRows: [
          ['Engineering Proposal', 'Chief / City Engineer', 'Technically Sound & Urgent', 'Recommended'],
          ['Budget Availability', 'Chief Accountant / Finance', 'Grant Allocation Available', 'Concurred'],
          ['Legal & Policy Check', 'Municipal Secretary', 'Within Competent Authority', 'Verified'],
          ['Final Admin Order', 'Municipal Commissioner / CO', 'Approved for Standing Committee', 'Approved']
        ],
        certificationNote:
          'Administrative approval is hereby granted for placing the proposal before the Standing Committee and issuing Technical Sanction.',
        signatoryTitle: 'Chief Accountant, ' + project.ulb,
        countersignTitle: 'Municipal Commissioner / Chief Officer'
      };

    case 9:
      return {
        fileName,
        docCode,
        docTitle: 'STANDING COMMITTEE RESOLUTION (STHAYI SAMITI THARAAV)',
        docSubtitle: 'Certified Extract of Standing Committee Resolution Register',
        date: '10 Jun 2026',
        summaryParagraph: `Certified copy of Standing Committee Resolution (Tharaav) of ${project.ulb} unanimously approving the implementation and expenditure sanction of ₹ ${cost.toFixed(2)} Cr for "${project.name}".`,
        keyMetrics: [
          { label: 'Tharaav (Resolution) No.', value: `SC/RES/2026/${104 + stage.stepNumber}` },
          { label: 'Meeting Agenda Item', value: 'Item No. 07 (Urgent Civic Works)' },
          { label: 'Sanctioned Budget', value: `₹ ${cost.toFixed(2)} Crore` },
          { label: 'Resolution Status', value: 'Unanimously Passed' }
        ],
        tableHeaders: ['Resolution Clause', 'Sanctioned Provision', 'Compliance Directive', 'Status'],
        tableRows: [
          ['Clause 1', `Administrative Outlay of ₹ ${cost.toFixed(2)} Cr`, 'Chargeable to Urban Infra Grant', 'Sanctioned'],
          ['Clause 2', 'Invitation of e-Tenders on nProcure', 'Follow State Purchase Policy', 'Authorized'],
          ['Clause 3', 'Third-Party Quality Audit (TPI)', 'Mandatory during Execution', 'Directed'],
          ['Clause 4', 'Monthly Progress Reporting', 'Submit to Standing Committee', 'Noted']
        ],
        certificationNote:
          'True copy extracted from the Proceedings Book of the Standing Committee Meeting held at Municipal Headquarters.',
        signatoryTitle: 'Municipal Secretary, ' + project.ulb,
        countersignTitle: 'Chairman, Standing Committee'
      };

    case 10:
      return {
        fileName,
        docCode,
        docTitle: 'TECHNICAL SANCTION (TS) ORDER — FORM P.W.D. 84',
        docSubtitle: 'Formal Statutory Technical Sanction Certificate',
        date: '16 Jun 2026',
        summaryParagraph: `Formal Technical Sanction (TS) accorded to the detailed plans and estimates for "${project.name}" (${project.ulb}) for ₹ ${cost.toFixed(2)} Cr by the Competent Technical Authority under CoMA.`,
        keyMetrics: [
          { label: 'TS Order Number', value: `TS/CoMA/2026/${project.id}` },
          { label: 'Technically Sanctioned Cost', value: `₹ ${cost.toFixed(2)} Crore` },
          { label: 'Competent Authority', value: 'Chief Engineer / CoMA Technical Cell' },
          { label: 'Validity of TS', value: 'Valid for Tendering & Execution' }
        ],
        tableHeaders: ['TS Component', 'Approved Specification', 'Sanctioned Limit (₹ Cr)', 'Status'],
        tableRows: [
          ['Civil & Structural Works', 'As per Approved DPR Drawings', `₹ ${civilCost} Cr`, 'Sanctioned'],
          ['Electro-Mechanical Works', 'IS-Marked Equipment Schedule', `₹ ${mepCost} Cr`, 'Sanctioned'],
          ['Quality Control & TPI', '1% Statutory QA/QC Allocation', `₹ ${contingencyCost} Cr`, 'Sanctioned'],
          ['Taxes & Statutory Levies', 'Applicable GST & Labour Cess', `₹ ${gstCost} Cr`, 'Sanctioned']
        ],
        certificationNote:
          'Technical Sanction is hereby accorded. No material deviation from sanctioned drawings or BoQ shall be made without prior approval.',
        signatoryTitle: 'Superintending Engineer (Tech)',
        countersignTitle: 'Chief Engineer, CoMA Gujarat'
      };

    case 11:
      return {
        fileName,
        docCode,
        docTitle: 'APPROVED DRAFT TENDER PAPER (DTP) & BID DOCUMENT',
        docSubtitle: 'Notice Inviting Tender (NIT), Qualification Criteria & Schedule-B',
        date: '22 Jun 2026',
        summaryParagraph: `Approved Draft Tender Paper (DTP) in Standard Form B-2 (Percentage / Item Rate) for inviting online bids on nProcure for "${project.name}" at ${project.ulb}.`,
        keyMetrics: [
          { label: 'Contract Form', value: 'Form B-2 (Two-Bid e-Tender)' },
          { label: 'Earnest Money Deposit (EMD)', value: `₹ ${(cost * 0.01).toFixed(2)} Cr (1%)` },
          { label: 'Bidder Class Required', value: ' Gujarat R&B / GWSSB Class-AA' },
          { label: 'Stipulated Completion', value: '18 Months (incl. Monsoon)' }
        ],
        tableHeaders: ['Bid Section', 'Document Section Title', 'Key Requirement', 'DTP Status'],
        tableRows: [
          ['Volume-I', 'Instruction to Bidders & NIT', 'Online Submission on nProcure', 'Approved'],
          ['Volume-I', 'Technical Qualification Criteria', `Min. Annual Turnover ₹ ${(cost * 0.5).toFixed(2)} Cr`, 'Approved'],
          ['Volume-II', 'General & Special Conditions (GCC/SCC)', '5-Year Defect Liability & 5% PBG', 'Approved'],
          ['Volume-III', 'Schedule-B (Price Bid BoQ)', `Estimated Amount ₹ ${cost.toFixed(2)} Cr`, 'Approved']
        ],
        certificationNote:
          'Draft Tender Paper (DTP) scrutinized and approved for publication on the Gujarat Government e-Procurement portal.',
        signatoryTitle: 'Executive Engineer (Tender Cell)',
        countersignTitle: 'Municipal Commissioner / Competent Authority'
      };

    case 12:
      return {
        fileName,
        docCode,
        docTitle: 'e-PROCUREMENT (nPROCURE) PUBLIC TENDER NOTICE',
        docSubtitle: 'Online Bid Publication Certificate & Newspaper Advertisement Copy',
        date: '28 Jun 2026',
        summaryParagraph: `Official e-Tender Notice published on the Gujarat nProcure Portal (https://nprocure.com) and leading state daily newspapers inviting competitive online bids for "${project.name}" (${project.ulb}).`,
        keyMetrics: [
          { label: 'nProcure Tender ID', value: `NPROC-2026-${project.id.slice(-3)}-884` },
          { label: 'Bid Download Start', value: '28 Jun 2026, 11:00 Hrs' },
          { label: 'Last Date of Online Bid', value: '20 Jul 2026, 18:00 Hrs' },
          { label: 'Technical Bid Opening', value: '21 Jul 2026, 12:00 Hrs' }
        ],
        tableHeaders: ['Publication Channel', 'Reference / Edition', 'Publication Date', 'Verification'],
        tableRows: [
          ['e-Procurement Portal', 'nProcure Gujarat Portal', '28 Jun 2026', 'Live & Published'],
          ['ULB Official Portal', `${project.ulb} Tender Notice Board`, '28 Jun 2026', 'Uploaded'],
          ['State Gujarati Daily', 'Statewide Edition (PR Dept)', '29 Jun 2026', 'Published'],
          ['National English Daily', 'Ahmedabad / Gujarat Edition', '29 Jun 2026', 'Published']
        ],
        certificationNote:
          'Certified that mandatory minimum bidding window has been provided in compliance with CVC and Gujarat State Procurement Guidelines.',
        signatoryTitle: 'nProcure Nodal Officer',
        countersignTitle: 'Executive Engineer, ' + project.ulb
      };

    case 13:
      return {
        fileName,
        docCode,
        docTitle: 'TECHNICAL BID EVALUATION COMMITTEE (TEC) REPORT',
        docSubtitle: 'Comparative Evaluation of Pre-Qualification & Technical Bids',
        date: '25 Jul 2026',
        summaryParagraph: `Minutes and Technical Evaluation Summary of the Tender Evaluation Committee (TEC) after scrutiny of online technical bids received for "${project.name}" (${project.ulb}).`,
        keyMetrics: [
          { label: 'Total Bids Received', value: '03 Online Bids' },
          { label: 'Technically Qualified', value: '03 Bidders Responsive' },
          { label: 'EMD & Solvency Check', value: '100% Verified from Issuing Banks' },
          { label: 'TEC Recommendation', value: 'Open Financial Bids (Schedule-B)' }
        ],
        tableHeaders: ['Bidder Name', 'Class & Registration', 'Similar Work & Turnover', 'Technical Status'],
        tableRows: [
          ['M/s. Shreeji Infra Projects Pvt. Ltd.', 'Class-AA (Approved)', 'Qualified (142% Criteria)', 'Responsive (Qualified)'],
          ['M/s. Patel Urban Engineering Ltd.', 'Class-AA (Approved)', 'Qualified (118% Criteria)', 'Responsive (Qualified)'],
          ['M/s. Suryam Epcon Construction LLP', 'Class-AA (Approved)', 'Qualified (109% Criteria)', 'Responsive (Qualified)']
        ],
        certificationNote:
          'All three participating agencies satisfy the minimum technical and financial eligibility criteria stipulated in the approved DTP.',
        signatoryTitle: 'Member Secretary, Tender Evaluation Committee',
        countersignTitle: 'Chairman, Tender Evaluation Committee'
      };

    case 14:
      return {
        fileName,
        docCode,
        docTitle: 'FINANCIAL BID OPENING & COMPARATIVE STATEMENT (L1 SHEET)',
        docSubtitle: 'Schedule-B Price Bid Evaluation & Lowest Bidder (L1) Determination',
        date: '30 Jul 2026',
        summaryParagraph: `Comparative Statement of online Price Bids (Schedule-B) opened on nProcure for "${project.name}" (${project.ulb}) against the put-to-tender cost of ₹ ${cost.toFixed(2)} Cr.`,
        keyMetrics: [
          { label: 'Amount Put to Tender', value: `₹ ${cost.toFixed(2)} Cr` },
          { label: 'Lowest (L1) Offer', value: `₹ ${l1Cost} Cr (-3.50% Below SOR)` },
          { label: 'L1 Agency', value: 'M/s. Shreeji Infra Projects Pvt. Ltd.' },
          { label: 'Rate Reasonableness', value: 'Within Workable Range (Recommended)' }
        ],
        tableHeaders: ['Rank', 'Qualified Bidder Name', 'Quoted Amount (₹ Cr)', '% Below / Above SOR'],
        tableRows: [
          ['L1', 'M/s. Shreeji Infra Projects Pvt. Ltd.', `₹ ${l1Cost} Cr`, '-3.50% Below Estimate'],
          ['L2', 'M/s. Patel Urban Engineering Ltd.', `₹ ${(cost * 0.988).toFixed(2)} Cr`, '-1.20% Below Estimate'],
          ['L3', 'M/s. Suryam Epcon Construction LLP', `₹ ${(cost * 1.015).toFixed(2)} Cr`, '+1.50% Above Estimate']
        ],
        certificationNote:
          'The L1 bid of M/s. Shreeji Infra Projects Pvt. Ltd. at 3.50% below estimated cost is competitive, workable, and recommended for acceptance.',
        signatoryTitle: 'Chief Accountant (Finance Vetting)',
        countersignTitle: 'Municipal Commissioner / Tender Accepting Authority'
      };

    case 15:
      return {
        fileName,
        docCode,
        docTitle: 'LETTER OF INTENT (LOI) / LETTER OF ACCEPTANCE',
        docSubtitle: 'Official Award Intimation to Successful L1 Bidder',
        date: '05 Aug 2026',
        summaryParagraph: `Official Letter of Intent (LoI) issued by ${project.ulb} to M/s. Shreeji Infra Projects Pvt. Ltd. communicating acceptance of their L1 bid of ₹ ${l1Cost} Cr for "${project.name}".`,
        keyMetrics: [
          { label: 'LoI Reference No.', value: `LOI/${project.id}/2026/08` },
          { label: 'Accepted Contract Value', value: `₹ ${l1Cost} Crore` },
          { label: 'Required 5% PBG', value: `₹ ${pbgAmount} Crore` },
          { label: 'Compliance Window', value: 'Within 15 Days of LoI' }
        ],
        tableHeaders: ['Directive Sr.', 'Pre-Agreement Requirement', 'Stipulated Detail', 'Timeline'],
        tableRows: [
          ['01', 'Performance Bank Guarantee (5%)', `₹ ${pbgAmount} Cr from Nationalized Bank`, 'Within 15 Days'],
          ['02', 'Contract Agreement Execution', 'On Non-Judicial Stamp Paper (Form B-2)', 'Within 15 Days'],
          ['03', 'Detailed MS-Project Bar Chart', 'Milestone-wise Execution Schedule', 'Within 10 Days'],
          ['04', 'Field Lab & QA/QC Setup', 'At Project Site prior to Commencement', 'Before Handover']
        ],
        certificationNote:
          'Please acknowledge receipt of this Letter of Intent and furnish the requisite Performance Security to execute the formal Contract Agreement.',
        signatoryTitle: 'Executive Engineer, ' + project.ulb,
        countersignTitle: 'Municipal Commissioner / Chief Officer'
      };

    case 16:
      return {
        fileName,
        docCode,
        docTitle: 'PERFORMANCE BANK GUARANTEE (PBG) VERIFICATION COPY',
        docSubtitle: '5% Performance Security Deposit & SFMS Bank Confirmation',
        date: '14 Aug 2026',
        summaryParagraph: `Verification record of the 5% Performance Bank Guarantee (PBG) submitted by the successful contractor and confirmed via Structured Financial Messaging System (SFMS) for "${project.name}".`,
        keyMetrics: [
          { label: 'Bank Guarantee No.', value: `SBI/BG/GNR/2026/${project.id.slice(-3)}91` },
          { label: 'Issuing Bank', value: 'State Bank of India (Commercial Branch)' },
          { label: 'Guaranteed Sum', value: `₹ ${pbgAmount} Crore (5% Contract Value)` },
          { label: 'SFMS Verification', value: 'Verified Authentic via Municipal Treasury' }
        ],
        tableHeaders: ['Security Instrument', 'Reference Number', 'Amount (₹ Cr)', 'Validity Upto'],
        tableRows: [
          ['Performance BG (5%)', `SBI/BG/GNR/2026/${project.id.slice(-3)}91`, `₹ ${pbgAmount} Cr`, '31 Dec 2028'],
          ['SFMS Confirmation Msg', 'IFN-760COV-9928174', '100% Matched', 'Verified by Bank'],
          ['Workmen Insurance (CAR)', 'NIACL/CAR/2026/4410', 'Full Contract Cover', '31 Dec 2028']
        ],
        certificationNote:
          'Original Performance Bank Guarantee has been verified with the issuing bank via SFMS and lodged in the Municipal Strong Room.',
        signatoryTitle: 'Accounts Officer (Treasury)',
        countersignTitle: 'Chief Accountant, ' + project.ulb
      };

    case 17:
      return {
        fileName,
        docCode,
        docTitle: 'CONTRACT AGREEMENT DEED (FORM B-2) & WORK ORDER',
        docSubtitle: 'Executed Legal Contract Agreement & Notice to Proceed',
        date: '18 Aug 2026',
        summaryParagraph: `Formal Contract Agreement executed in Form B-2 between ${project.ulb} and M/s. Shreeji Infra Projects Pvt. Ltd., accompanied by the formal Work Order to commence execution of "${project.name}".`,
        keyMetrics: [
          { label: 'Agreement No.', value: `AGR/B2/2026/${project.id}` },
          { label: 'Work Order Date', value: '18 Aug 2026' },
          { label: 'Scheduled Completion', value: '17 Feb 2028 (18 Months)' },
          { label: 'Contract Sum', value: `₹ ${l1Cost} Crore` }
        ],
        tableHeaders: ['Contract Clause', 'Covenant Description', 'Binding Provision', 'Status'],
        tableRows: [
          ['Clause 1', 'Scope & Contract Price', `Fixed Item-Rate / % Contract at ₹ ${l1Cost} Cr`, 'Executed'],
          ['Clause 2', 'Time for Completion', '18 Calendar Months from Work Order', 'Binding'],
          ['Clause 14', 'Liquidated Damages', '0.1% per day of delay (Max 10%)', 'Enforceable'],
          ['Clause 17', 'Defect Liability Period (DLP)', '60 Months from Completion Certificate', 'Binding']
        ],
        certificationNote:
          'Signed, sealed, and delivered by the authorized representatives of the Urban Local Body and the Contractor in the presence of witnesses.',
        signatoryTitle: 'Authorized Signatory (EPC Contractor)',
        countersignTitle: 'Municipal Commissioner / Executive Engineer'
      };

    case 18:
      return {
        fileName,
        docCode,
        docTitle: 'JOINT SITE HANDOVER ROJKAM (POSSESSION CERTIFICATE)',
        docSubtitle: 'Encumbrance-Free Site Possession & Benchmark Handover Record',
        date: '22 Aug 2026',
        summaryParagraph: `Joint Site Handover Rojkam (Panchnama) recording physical handover of the project site, alignment markers, and Temporary Benchmarks (TBMs) to the contractor for "${project.name}" (${project.ulb}).`,
        keyMetrics: [
          { label: 'Site Handover Date', value: '22 Aug 2026 (10:30 Hrs)' },
          { label: 'Possession Extent', value: '100% Project Footprint Handed Over' },
          { label: 'Obstructions / Trees', value: 'Nil (Clear Working Front)' },
          { label: 'Commencement Trigger', value: 'Execution Clock Active' }
        ],
        tableHeaders: ['Handover Asset', 'Location / Reference', 'Condition at Handover', 'Joint Sign-off'],
        tableRows: [
          ['Project Site Corridor', `${project.ulb} Designated Ward Zone`, 'Clear & Demarcated', 'Handed Over'],
          ['Survey Control Points', 'TBM-01, TBM-02 & Boundary Pillars', 'Concrete Pillars Intact', 'Verified'],
          ['Site Camp & Material Yard', 'Adjacent Municipal Plot', 'Allocated for QA Lab', 'Handed Over'],
          ['Public Safety Barricading', 'Full Perimeter', 'Installed by Agency', 'Inspected']
        ],
        certificationNote:
          'We hereby certify that physical possession of the project site has been handed over and taken over without any encumbrance.',
        signatoryTitle: 'Project Manager (Contractor) & PMC Engineer',
        countersignTitle: 'Dy. Executive Engineer, ' + project.ulb
      };

    case 19:
      return {
        fileName,
        docCode,
        docTitle: 'GOOD FOR CONSTRUCTION (GFC) DESIGN & DRAWING APPROVAL',
        docSubtitle: 'Proof-Checked Structural, Hydraulic & Working Drawings Release Sheet',
        date: '01 Sep 2026',
        summaryParagraph: `Formal release of Good for Construction (GFC) engineering drawings and design mix formulas for "${project.name}" (${project.ulb}), duly vetted by the Government Engineering College / SVNIT Proof Consultant and PMC.`,
        keyMetrics: [
          { label: 'Proof Vetting Institute', value: 'L.D. College of Engineering (LDCE) / SVNIT' },
          { label: 'GFC Drawings Released', value: '18 Approved Working Drawings' },
          { label: 'Concrete Design Mix', value: 'M30 & M25 Job-Mix Approved' },
          { label: 'Execution Clearance', value: 'Stamped "GOOD FOR CONSTRUCTION"' }
        ],
        tableHeaders: ['Drawing No.', 'Drawing Title', 'Revision', 'Approval Status'],
        tableRows: [
          [`GFC/${project.id}/01`, 'Master Key Plan & Setting-Out Layout', 'Rev-0 (Final)', 'Approved GFC'],
          [`GFC/${project.id}/02`, 'Foundation & Excavation Structural Details', 'Rev-0 (Final)', 'Approved GFC'],
          [`GFC/${project.id}/03`, 'Reinforcement Bar Bending Schedule (BBS)', 'Rev-0 (Final)', 'Approved GFC'],
          [`GFC/${project.id}/04`, 'Electro-Mechanical & Utility Integration', 'Rev-0 (Final)', 'Approved GFC']
        ],
        certificationNote:
          'All GFC drawings have been proof-checked for structural stability and hydraulic adequacy and are released for site execution.',
        signatoryTitle: 'Team Leader (PMC) & Structural Proof Consultant',
        countersignTitle: 'Executive Engineer, ' + project.ulb
      };

    case 20:
      return {
        fileName,
        docCode,
        docTitle: 'CONSTRUCTION EXECUTION & MONTHLY PROGRESS REPORT (MPR)',
        docSubtitle: 'Field Execution Log, Quality Control Register & Milestone Tracker',
        date: '15 Oct 2026',
        summaryParagraph: `Field Construction Execution report for "${project.name}" (${project.ulb}), documenting physical milestone achievement, batching plant concrete cube test results, and daily workforce/machinery deployment.`,
        keyMetrics: [
          { label: 'Physical Progress', value: 'On Schedule (As per Approved Bar Chart)' },
          { label: 'Quality Test Pass Rate', value: '100% (28-Day Cube Strength > 36.5 MPa)' },
          { label: 'Safety Compliance', value: 'Zero Lost-Time Injury (LTI)' },
          { label: 'Geo-Tagged Photos', value: 'Uploaded on CoMA Portal' }
        ],
        tableHeaders: ['Work Package', 'Target Quantity', 'Executed at Site', 'Quality Check'],
        tableRows: [
          ['Earthwork & Foundation', '100% Scope', '100% Completed', 'Compaction > 98% MDD'],
          ['Substructure RCC (M30)', '100% Scope', '85% Completed', 'Cube Tests Passed'],
          ['Main Superstructure / Grid', '100% Scope', '60% In Progress', 'TMT Mill Cert Verified'],
          ['Allied Civic Finishing', '100% Scope', '25% In Progress', 'Material Approved']
        ],
        certificationNote:
          'Construction work is progressing strictly in accordance with approved GFC drawings and technical specifications.',
        signatoryTitle: 'Resident Engineer (PMC)',
        countersignTitle: 'Executive Engineer, ' + project.ulb
      };

    case 21:
      return {
        fileName,
        docCode,
        docTitle: 'REQUEST FOR INSPECTION (RFI) & POUR CARD SHEET',
        docSubtitle: 'Contractor QA/QC Pre-Execution & Pre-Concrete Inspection Request',
        date: '22 Oct 2026',
        summaryParagraph: `Official Request for Inspection (RFI) submitted by the Contractor QA/QC Engineer inviting joint verification of shuttering, reinforcement bar placement, cover blocks, and alignment for "${project.name}".`,
        keyMetrics: [
          { label: 'RFI Reference No.', value: `RFI/${project.id}/2026/042` },
          { label: 'Element Inspected', value: 'Main Structural Zone — Stage-II RCC' },
          { label: 'Steel Grade Verified', value: 'Fe500D Primary Producer TMT' },
          { label: 'Slump Check at Site', value: '110 mm (Within 100–125 mm Spec)' }
        ],
        tableHeaders: ['Check Parameter', 'Specified Tolerance', 'Actual Site Measurement', 'QA/QC Result'],
        tableRows: [
          ['Line, Level & Plumb', '± 3 mm max', '+ 1.0 mm (Total Station)', 'Pass'],
          ['Reinforcement Spacing & Dia', 'As per Approved BBS', '100% Matched with GFC', 'Pass'],
          ['Clear Concrete Cover', '40 mm Cover Blocks', '40 mm PVC/Cement Blocks Fixed', 'Pass'],
          ['Formwork Watertightness', 'Zero Slurry Leakage', 'Steel Shuttering Oiled & Sealed', 'Pass']
        ],
        certificationNote:
          'Preliminary quality checks completed by Contractor QA/QC team. Ready for joint PMC and ULB Engineer inspection.',
        signatoryTitle: 'QA/QC Engineer (Contractor)',
        countersignTitle: 'Field Quality Engineer (PMC)'
      };

    case 22:
      return {
        fileName,
        docCode,
        docTitle: 'JOINT SITE INSPECTION & QUALITY CLEARANCE REPORT',
        docSubtitle: 'PMC, Third-Party Inspection (TPI) & ULB Site Engineer Field Report',
        date: '24 Oct 2026',
        summaryParagraph: `Joint Site Inspection report recorded by the ULB Site Engineer, PMC Resident Engineer, and Third-Party Inspection (TPI) Auditor after physical verification of executed works for "${project.name}" (${project.ulb}).`,
        keyMetrics: [
          { label: 'Inspection ID', value: `JSI/${project.id}/2026/19` },
          { label: 'TPI Agency', value: 'Govt. Empanelled TPI Auditor' },
          { label: 'Non-Conformance (NCR)', value: 'Nil (0 Open NCRs)' },
          { label: 'Clearance Decision', value: 'Cleared for Measurement & Billing' }
        ],
        tableHeaders: ['Inspection Discipline', 'Field Test / Verification', 'Observed Value', 'Clearance'],
        tableRows: [
          ['Dimensional Check', 'Steel Tape & Laser Level', 'Within IS Tolerance', 'Approved'],
          ['NDT / Rebound Hammer', 'Surface Hardness Check', '38.4 MPa (> 30 MPa Spec)', 'Approved'],
          ['Material Traceability', 'Cement & Steel MTC Batch', 'Verified with Tax Invoices', 'Approved'],
          ['Workmanship & Safety', 'Visual & Alignment Audit', 'Satisfactory', 'Approved']
        ],
        certificationNote:
          'Jointly inspected on site and certified that the executed work conforms to contract specifications and is fit for e-MB recording.',
        signatoryTitle: 'TPI Auditor & PMC Resident Engineer',
        countersignTitle: 'Deputy Executive Engineer, ' + project.ulb
      };

    case 23:
      return {
        fileName,
        docCode,
        docTitle: 'CONTRACTOR RUNNING ACCOUNT (RA) BILL & TAX INVOICE',
        docSubtitle: 'Abstract of Executed Quantities, Measurement Summary & GST Invoice',
        date: '02 Nov 2026',
        summaryParagraph: `Running Account Bill (RA Bill-03) submitted by M/s. Shreeji Infra Projects Pvt. Ltd. claiming payment for measured and quality-cleared physical works executed under "${project.name}" (${project.ulb}).`,
        keyMetrics: [
          { label: 'RA Bill Number', value: 'RA Bill No. 03 (Interim)' },
          { label: 'Gross Work Value (Current)', value: `₹ ${raBillAmount} Crore` },
          { label: 'GSTIN Verification', value: '24AABCS1429B1Z5 (Active)' },
          { label: 'Enclosures Attached', value: 'MTCs, Cube Reports, RFI & Photos' }
        ],
        tableHeaders: ['BoQ Item No.', 'Description of Executed Item', 'Billed Qty', 'Amount (₹ Cr)'],
        tableRows: [
          ['Item 1.02', 'Excavation, Dewatering & Sub-base Preparation', '4,850 Cu.m', `₹ ${( Number(raBillAmount) * 0.18).toFixed(2)} Cr`],
          ['Item 2.05', 'Providing & Laying RCC M30 Grade with Batch Mix', '1,920 Cu.m', `₹ ${(Number(raBillAmount) * 0.46).toFixed(2)} Cr`],
          ['Item 3.01', 'Fe500D TMT Reinforcement Cutting, Bending & Placing', '215 MT', `₹ ${(Number(raBillAmount) * 0.24).toFixed(2)} Cr`],
          ['Item 4.04', 'Allied Pipeline / Electro-Mechanical Installation', 'Lump Sum', `₹ ${(Number(raBillAmount) * 0.12).toFixed(2)} Cr`]
        ],
        certificationNote:
          'Certified that the quantities claimed in this RA Bill have been actually executed at site and have not been claimed in any previous bill.',
        signatoryTitle: 'Billing Head (EPC Contractor)',
        countersignTitle: 'Received by Inward Section, ' + project.ulb
      };

    case 24:
      return {
        fileName,
        docCode,
        docTitle: 'MEASUREMENT BOOK (e-MB) SITE VERIFICATION & TEST-CHECK',
        docSubtitle: 'Statutory 100% Assistant Engineer & 25% Dy. Executive Engineer Check',
        date: '06 Nov 2026',
        summaryParagraph: `Certified extract of Electronic Measurement Book (e-MB No. 412, Pages 18 to 34) recording item-wise physical measurements and statutory test-checks at site for "${project.name}" (${project.ulb}).`,
        keyMetrics: [
          { label: 'e-MB Book & Page Ref', value: 'e-MB #412 / Pages 18–34' },
          { label: '100% Measurement By', value: 'Assistant Engineer (Ward/Site)' },
          { label: '25% Test-Check By', value: 'Deputy Executive Engineer' },
          { label: '10% Super-Check By', value: 'Executive Engineer' }
        ],
        tableHeaders: ['Check Level', 'Checking Officer Designation', 'Mandated %', 'Verified Status'],
        tableRows: [
          ['Primary Recording', 'Assistant / Junior Site Engineer', '100% Items Measured', 'Recorded in e-MB'],
          ['Sub-Divisional Check', 'Deputy Executive Engineer', '25% Critical Items', 'Test-Checked & Signed'],
          ['Divisional Super-Check', 'Executive Engineer', '10% High-Value Items', 'Verified on Site'],
          ['Arithmetic Audit', 'Divisional Accounts Clerk', '100% Extensions', 'Checked Correct']
        ],
        certificationNote:
          'Measurements recorded in e-MB #412 have been physically test-checked on site and found accurate with zero discrepancy.',
        signatoryTitle: 'Deputy Executive Engineer (MB Check)',
        countersignTitle: 'Executive Engineer, ' + project.ulb
      };

    case 25:
      return {
        fileName,
        docCode,
        docTitle: 'PMC BILL SCRUTINY & PAYMENT RECOMMENDATION CERTIFICATE',
        docSubtitle: 'Net Payable Calculation after Statutory Tax & Security Deductions',
        date: '10 Nov 2026',
        summaryParagraph: `PMC Bill Verification Certificate and Payment Recommendation Note for RA Bill-03 of "${project.name}" (${project.ulb}), detailing gross certified value, statutory deductions, and net payable amount.`,
        keyMetrics: [
          { label: 'Gross Certified Bill', value: `₹ ${raBillAmount} Crore` },
          { label: 'Total Deductions (10%)', value: `₹ ${(Number(raBillAmount) * 0.1).toFixed(2)} Crore` },
          { label: 'Net Payable Recommended', value: `₹ ${netRaPayable} Crore` },
          { label: 'Quality Hold / Penalty', value: 'Nil (All QA Criteria Met)' }
        ],
        tableHeaders: ['Particulars', 'Rate / Norm', 'Amount (₹ Cr)', 'Accounting Head'],
        tableRows: [
          ['Gross Value of Work Done (RA-03)', 'As per e-MB #412', `₹ ${raBillAmount} Cr`, 'Capital Project Exp.'],
          ['Less: Security Retention Deposit', '5.0% of Bill', `- ₹ ${(Number(raBillAmount) * 0.05).toFixed(2)} Cr`, 'Deposit Account'],
          ['Less: Income Tax TDS & GST TDS', '2.0% + 2.0%', `- ₹ ${(Number(raBillAmount) * 0.04).toFixed(2)} Cr`, 'Statutory Tax Head'],
          ['Less: Building & Welfare Labour Cess', '1.0% of Bill', `- ₹ ${(Number(raBillAmount) * 0.01).toFixed(2)} Cr`, 'GWBW Board Cess'],
          ['NET RECOMMENDED PAYMENT', '90.0% Net Release', `₹ ${netRaPayable} Cr`, 'RTGS / PFMS Release']
        ],
        certificationNote:
          'Bill scrutinized against contract BoQ, e-MB #412, and quality certificates. Recommended for net payment release.',
        signatoryTitle: 'Billing & Contracts Specialist (PMC)',
        countersignTitle: 'Executive Engineer, ' + project.ulb
      };

    case 26:
      return {
        fileName,
        docCode,
        docTitle: 'MUNICIPAL TREASURY PAYMENT VOUCHER & PFMS / RTGS ADVICE',
        docSubtitle: 'Electronic Fund Transfer (UTR) & Statutory Remittance Receipt',
        date: '14 Nov 2026',
        summaryParagraph: `Official Treasury Payment Voucher and PFMS/RTGS electronic disbursement advice confirming release of ₹ ${netRaPayable} Cr to the contractor's designated project account for "${project.name}" (${project.ulb}).`,
        keyMetrics: [
          { label: 'Treasury Voucher No.', value: `TV/2026-27/11/${project.id.slice(-3)}` },
          { label: 'PFMS / RTGS UTR No.', value: 'SBINR52026111488392014' },
          { label: 'Net Disbursed Sum', value: `₹ ${netRaPayable} Crore` },
          { label: 'Payment Status', value: 'Credited & Settled' }
        ],
        tableHeaders: ['Disbursement Component', 'Beneficiary / Authority', 'UTR / Challan Ref', 'Amount (₹ Cr)'],
        tableRows: [
          ['Net Contractor Payment', 'M/s. Shreeji Infra Projects Pvt. Ltd.', 'SBINR52026111488392014', `₹ ${netRaPayable} Cr`],
          ['Income Tax & GST TDS', 'Central Board of Direct Taxes / GSTN', 'CIN-26111400982', `₹ ${(Number(raBillAmount) * 0.04).toFixed(2)} Cr`],
          ['Labour Welfare Cess (1%)', 'Gujarat BOCW Welfare Board', 'BOCW-CH-88219', `₹ ${(Number(raBillAmount) * 0.01).toFixed(2)} Cr`],
          ['Security Deposit (5%)', `${project.ulb} Retention Ledger`, 'SD-LEDGER-412', `₹ ${(Number(raBillAmount) * 0.05).toFixed(2)} Cr`]
        ],
        certificationNote:
          'Payment disbursed electronically via PFMS/RTGS after pre-audit verification. Paid vouchers stamped and archived.',
        signatoryTitle: 'Chief Accountant / Auditor, ' + project.ulb,
        countersignTitle: 'Municipal Commissioner / Drawing & Disbursing Officer'
      };

    case 27:
      return {
        fileName,
        docCode,
        docTitle: 'FINAL JOINT SITE INSPECTION & COMMISSIONING REPORT',
        docSubtitle: '72-Hour Full-Load Trial Run, Testing & Snag-Free Verification',
        date: '10 Jan 2028',
        summaryParagraph: `Final Joint Site Inspection and Trial Run Commissioning Report conducted by the Joint Inspection Committee upon 100% physical completion of "${project.name}" at ${project.ulb}.`,
        keyMetrics: [
          { label: 'Physical Completion', value: '100% of Contract Scope Completed' },
          { label: '72-Hr Trial Run', value: 'Successfully Tested at Full Load' },
          { label: 'Punch / Snag List', value: '100% Rectified & Closed' },
          { label: 'As-Built Drawings', value: 'Submitted & Verified (Hard + CAD)' }
        ],
        tableHeaders: ['Commissioning Test', 'Performance Standard', 'Measured Result', 'Verdict'],
        tableRows: [
          ['Civil & Structural Finish', 'Zero Seepage / Deflection', 'Passed Hydro & Load Test', 'Commissioned'],
          ['System Capacity / Output', '100% Designed DPR Capacity', '102% Rated Performance', 'Commissioned'],
          ['Safety & Statutory NOCs', 'Electrical / Fire / GPCB Check', 'All Clearances Obtained', 'Verified'],
          ['Site Restoration', 'Debris Removal & Landscaping', 'Site Restored Cleanly', 'Verified']
        ],
        certificationNote:
          'The completed infrastructure asset has been jointly inspected, tested under full operating conditions, and found ready for public commissioning.',
        signatoryTitle: 'Joint Inspection Team (PMC, TPI & ULB Engineers)',
        countersignTitle: 'Superintending Engineer, ' + project.ulb
      };

    case 28:
      return {
        fileName,
        docCode,
        docTitle: 'OFFICIAL PROJECT COMPLETION CERTIFICATE (PCC)',
        docSubtitle: 'Statutory Form P.W.D. Completion Certificate & Final Cost Statement',
        date: '20 Jan 2028',
        summaryParagraph: `Statutory Project Completion Certificate issued by ${project.ulb} certifying that "${project.name}" has been satisfactorily completed within the sanctioned cost and stipulated technical parameters.`,
        keyMetrics: [
          { label: 'Certificate No.', value: `PCC/CoMA/2028/${project.id}` },
          { label: 'Date of Completion', value: '18 Jan 2028 (Within Scheduled Time)' },
          { label: 'Final Executed Cost', value: `₹ ${l1Cost} Crore (Within Sanction)` },
          { label: 'DLP Period Active', value: '18 Jan 2028 to 17 Jan 2033 (5 Years)' }
        ],
        tableHeaders: ['Project Milestone', 'Sanctioned / Stipulated', 'Actual Achieved', 'Performance'],
        tableRows: [
          ['Project Capital Cost', `Sanctioned: ₹ ${cost.toFixed(2)} Cr`, `Executed: ₹ ${l1Cost} Cr`, '3.5% Saving Achieved'],
          ['Commencement Date', '18 Aug 2026', '18 Aug 2026', 'On Time'],
          ['Completion Date', '17 Feb 2028', '18 Jan 2028', '30 Days Ahead of Schedule'],
          ['Quality & Safety Record', 'Zero Major Defects', '100% TPI Certified', 'Exemplary']
        ],
        certificationNote:
          'Certified that the work has been completed strictly in accordance with sanctioned plans and specifications, and the 5-year Defect Liability Period commences herewith.',
        signatoryTitle: 'Chief Engineer, ' + project.ulb,
        countersignTitle: 'Municipal Commissioner / Chief Officer'
      };

    case 29:
    default:
      return {
        fileName,
        docCode,
        docTitle: 'FINAL PROJECT HANDOVER & ASSET TRANSFER MEMORANDUM',
        docSubtitle: 'Transfer of Commissioned Civic Asset & O&M Manuals to Municipal O&M Wing',
        date: '28 Jan 2028',
        summaryParagraph: `Official Project Handover Memorandum recording the formal transfer of the completed and commissioned infrastructure asset "${project.name}" from the Project Execution Cell to the Municipal Operations & Maintenance (O&M) Wing of ${project.ulb}.`,
        keyMetrics: [
          { label: 'Municipal Asset ID', value: `ASSET-${project.ulb.slice(0, 3).toUpperCase()}-2028-${project.id.slice(-3)}` },
          { label: 'Capitalized Asset Value', value: `₹ ${l1Cost} Crore` },
          { label: 'O&M Manuals & Spares', value: '04 Sets + As-Built CAD Handed Over' },
          { label: 'Asset Lifecycle Status', value: 'Commissioned & In Public Service' }
        ],
        tableHeaders: ['Handover Document / Asset', 'Reference / Quantity', 'Receiving Wing', 'Transfer Status'],
        tableRows: [
          ['Civil & Electro-Mechanical Asset', '100% Commissioned Facility', 'Municipal O&M Wing', 'Taken Over'],
          ['As-Built Drawings & GIS Layer', 'Full Digital & Hardcopy Set', 'ULB GIS & Engineering Cell', 'Archived'],
          ['Standard Operating Manual (SOP)', '04 Bound Volumes', 'Facility Operations Team', 'Handed Over'],
          ['Municipal Fixed Asset Register', `Capitalized at ₹ ${l1Cost} Cr`, 'Municipal Accounts & Audit', 'Capitalized']
        ],
        certificationNote:
          'The completed project asset, along with all as-built drawings, warranties, and O&M manuals, is formally handed over and taken over for public civic service.',
        signatoryTitle: 'Executive Engineer (Project Cell — Handing Over)',
        countersignTitle: 'Executive Engineer (O&M Wing — Taking Over)'
      };
  }
}

export const StageSoftCopyModal: React.FC<StageSoftCopyModalProps> = ({
  stage,
  project,
  isCompleted,
  onClose,
  onMarkComplete
}) => {
  const doc = getStageDocumentContent(stage, project);

  const handleDownloadSoftCopy = () => {
    const textContent = [
      `STAGE ${String(stage.stepNumber).padStart(2, '0')} OF 29: ${stage.title.toUpperCase()}`,
      `Document: ${doc.docTitle}`,
      `Reference: ${doc.docCode} | Date: ${doc.date}`,
      `Proposal: ${project.name} (${project.ulb}) | Est. Cost: ₹ ${(Number(project.estimatedCost) || 0).toFixed(2)} Cr`,
      '',
      doc.summaryParagraph,
      '',
      doc.tableHeaders.join(' | '),
      '-'.repeat(64),
      ...doc.tableRows.map(r => r.join(' | ')),
      '',
      `Verified By: ${doc.signatoryTitle}`,
      `Approved By: ${doc.countersignTitle}`
    ].join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName.replace(/\.pdf$/i, '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Sleek Top Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded-md bg-[#0E355C] text-white font-mono text-xs font-bold shrink-0">
              {String(stage.stepNumber).padStart(2, '0')}
            </span>
            <h3 className="text-sm font-bold text-[#0E355C] truncate">{stage.title}</h3>
            <span className="text-xs text-slate-400 hidden sm:inline">· {doc.fileName}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadSoftCopy}
              className="h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            {!isCompleted && (
              <button
                type="button"
                onClick={onMarkComplete}
                className="h-7 px-3 rounded-lg bg-[#0E355C] hover:bg-[#092644] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete Stage</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sleek Stage-Specific Document Body */}
        <div className="p-6 space-y-4 text-slate-800">
          {/* Header & Proposal Meta */}
          <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">{doc.docTitle}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {project.name} · {project.ulb} · ₹ {(Number(project.estimatedCost) || 0).toFixed(2)} Cr
              </p>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              <div>{doc.docCode}</div>
              <div>{doc.date}</div>
            </div>
          </div>

          {/* Unique Visual Document Format for Each of the 29 Stages */}
          <StageDistinctBody stage={stage} project={project} doc={doc} />

          {/* Minimal Sign-off Footer */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Prepared by: <strong className="text-slate-800">{doc.signatoryTitle}</strong>
            </span>
            <span>
              Approved by: <strong className="text-[#0E355C]">{doc.countersignTitle}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
