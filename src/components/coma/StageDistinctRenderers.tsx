import React from 'react';
import {
  Check,
  MapPin,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  Stamp,
  Calendar,
  Building2,
  Landmark,
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { ProposalFlowStage, ProposalProjectSummary } from './ProposalLifecycleFlowView';

export interface StageDocData {
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

export const StageDistinctBody: React.FC<{
  stage: ProposalFlowStage;
  project: ProposalProjectSummary;
  doc: StageDocData;
}> = ({ stage, project, doc }) => {
  const cost = Number(project.estimatedCost) || 25.0;
  const l1Cost = (cost * 0.965).toFixed(2);
  const pbgAmount = (cost * 0.965 * 0.05).toFixed(2);
  const raBill = (cost * 0.28).toFixed(2);
  const netPayable = (cost * 0.28 * 0.9).toFixed(2);

  switch (stage.stepNumber) {
    // 1. PROPOSAL SUBMISSION -> Official Form-A Application Sheet
    case 1:
      return (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between bg-[#0E355C] text-white px-4 py-2.5 rounded-lg">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                Form-A · Application for Scheme Registration
              </div>
              <div className="font-bold text-sm">{project.name}</div>
            </div>
            <span className="font-mono text-xs bg-white/15 px-2.5 py-1 rounded">
              ID: {project.id}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {doc.tableRows.map((r, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                <div className="text-[10px] font-bold uppercase text-slate-400">
                  Field {r[0]} · {r[1]}
                </div>
                <div className="font-bold text-slate-900 mt-1">{r[2]}</div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/40 text-slate-700">
            <span className="font-bold text-[#0E355C]">Justification: </span>
            {doc.summaryParagraph}
          </div>
        </div>
      );

    // 2. PRELIMINARY SURVEY -> Topographical DGPS Survey Map & Coordinates Plot
    case 2:
      return (
        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-emerald-300 bg-emerald-950 text-emerald-100 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-300 font-bold">
                <Compass className="w-4 h-4" /> DGPS TOPOGRAPHICAL CONTOUR PLOT · 23.2156° N, 72.6369° E
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-800 text-[10px] font-mono">
                Scale 1:500
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px]">
              {doc.tableRows.map((r, i) => (
                <div key={i} className="p-2 rounded bg-emerald-900/80 border border-emerald-700">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 mx-auto mb-1" />
                  <div className="text-emerald-300 font-bold">{r[0]}</div>
                  <div className="text-[10px] text-emerald-100 mt-0.5">{r[2]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {doc.keyMetrics.slice(0, 2).map((m, i) => (
              <div key={i} className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500">{m.label}:</span>
                <span className="font-bold text-slate-900">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    // 3. FEASIBILITY STUDY -> Option-I vs Option-II Viability Scorecard
    case 3:
      return (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-[10px] font-bold uppercase text-slate-400">Alternative A</div>
              <div className="font-bold text-slate-700 text-sm mt-0.5">Option-I: Conventional</div>
              <div className="mt-2 space-y-1 text-slate-600">
                <div>Capex: <strong>₹ {(cost * 1.08).toFixed(2)} Cr</strong></div>
                <div>Annual O&amp;M: <strong>₹ {(cost * 0.045).toFixed(2)} Cr/yr</strong></div>
                <div>Duration: <strong>24 Months</strong></div>
              </div>
            </div>
            <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 relative">
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase">
                Selected
              </span>
              <div className="text-[10px] font-bold uppercase text-emerald-700">Alternative B</div>
              <div className="font-bold text-emerald-950 text-sm mt-0.5">Option-II: Modular Design</div>
              <div className="mt-2 space-y-1 text-emerald-900">
                <div>Capex: <strong>₹ {cost.toFixed(2)} Cr (7.4% Saving)</strong></div>
                <div>Annual O&amp;M: <strong>₹ {(cost * 0.028).toFixed(2)} Cr/yr</strong></div>
                <div>EIRR: <strong>14.8% (Feasible)</strong></div>
              </div>
            </div>
          </div>
          <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            {doc.certificationNote}
          </p>
        </div>
      );

    // 4. DPR PREPARATION -> Stacked Cost Proportion Bar & 3-Volume Dossier Cards
    case 4:
      return (
        <div className="space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 text-white">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-bold text-amber-300 uppercase text-[10px] tracking-wider">
                DPR Capital Outlay Allocation
              </span>
              <span className="font-mono font-bold text-base">₹ {cost.toFixed(2)} Cr</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-700">
              <div className="bg-blue-500 h-full w-[72%]" title="Civil 72%" />
              <div className="bg-teal-400 h-full w-[16%]" title="MEP 16%" />
              <div className="bg-amber-400 h-full w-[4%]" title="QA 4%" />
              <div className="bg-rose-400 h-full w-[8%]" title="GST 8%" />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2.5 text-[10px]">
              <div><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />Civil: ₹ {(cost * 0.72).toFixed(2)} Cr</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-1" />MEP: ₹ {(cost * 0.16).toFixed(2)} Cr</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1" />QA/TPI: ₹ {(cost * 0.04).toFixed(2)} Cr</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-rose-400 mr-1" />GST: ₹ {(cost * 0.08).toFixed(2)} Cr</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="font-mono text-[10px] font-bold text-[#0E355C]">VOLUME I</div>
              <div className="font-semibold text-slate-900 mt-0.5">Design Report</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="font-mono text-[10px] font-bold text-[#0E355C]">VOLUME II</div>
              <div className="font-semibold text-slate-900 mt-0.5">Detailed BoQ &amp; SOR</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="font-mono text-[10px] font-bold text-[#0E355C]">VOLUME III</div>
              <div className="font-semibold text-slate-900 mt-0.5">14 GFC Drawings</div>
            </div>
          </div>
        </div>
      );

    // 5. DPR VERIFICATION -> Checklist Audit Stamp Sheet
    case 5:
      return (
        <div className="space-y-2.5 text-xs">
          {doc.tableRows.map((r, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <div>
                  <div className="font-bold text-slate-900">{r[1]}</div>
                  <div className="text-[11px] text-slate-500">{r[2]}</div>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {r[0]} · PASS
              </span>
            </div>
          ))}
        </div>
      );

    // 6. TECHNICAL SCRUTINY -> BIS Code Vetting & Query Compliance Pairs
    case 6:
      return (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div>
              <div className="text-[10px] font-bold uppercase text-blue-700">BIS &amp; CPHEEO Code Vetting</div>
              <div className="font-bold text-[#0E355C]">IS:456:2000 · IS:3370 · IS:1893 Seismic Zone-III</div>
            </div>
            <ShieldCheck className="w-6 h-6 text-[#0E355C]" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {doc.tableRows.map((r, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between">
                <div className="font-bold text-slate-900">{r[0]}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{r[1]} — {r[2]}</div>
                <div className="text-[10px] font-bold text-emerald-700 mt-1">✓ {r[3]}</div>
              </div>
            ))}
          </div>
        </div>
      );

    // 7. COST ESTIMATION -> SOR Financial Calculation Sheet
    case 7:
      return (
        <div className="space-y-2.5 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-sans font-bold text-[#0E355C] pb-1.5 border-b border-slate-200">
              <FileSpreadsheet className="w-4 h-4" /> Gujarat SOR 2025-26 Abstract Computation
            </div>
            {doc.tableRows.map((r, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span>{r[0]} ({r[1]})</span>
                <span className="font-bold text-slate-900">{r[2]}</span>
              </div>
            ))}
            <div className="flex justify-between pt-1 text-sm font-bold text-[#0E355C]">
              <span>SANCTIONABLE ESTIMATE TOTAL</span>
              <span>₹ {cost.toFixed(2)} Cr</span>
            </div>
          </div>
        </div>
      );

    // 8. COMMISSIONER APPROVAL -> Official Green-Sheet File Noting (e-Sarkar)
    case 8:
      return (
        <div className="p-4 rounded-xl bg-[#ECFDF3] border-2 border-emerald-300 space-y-2.5 text-xs text-emerald-950">
          <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800">
              e-Sarkar Green Sheet · Administrative File Noting
            </span>
            <span className="font-mono text-[11px] font-bold">{doc.keyMetrics[0]?.value}</span>
          </div>
          <p className="leading-relaxed">
            <strong>Note Para 1:</strong> Proposal for <em>&ldquo;{project.name}&rdquo;</em> submitted by Engineering Wing for ₹ {cost.toFixed(2)} Cr.
          </p>
          <p className="leading-relaxed">
            <strong>Note Para 2:</strong> Chief Accountant has verified grant availability under SJMMSVY / Urban Infrastructure head.
          </p>
          <div className="p-2.5 rounded bg-white/80 border border-emerald-300 font-bold text-[#0E355C] flex items-center justify-between">
            <span>&ldquo;Administratively Approved. Place before Standing Committee.&rdquo;</span>
            <span className="text-[10px] uppercase text-emerald-700">— Municipal Commissioner</span>
          </div>
        </div>
      );

    // 9. STANDING COMMITTEE APPROVAL -> Sthayi Samiti Tharaav Resolution Certificate
    case 9:
      return (
        <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/40 space-y-3 text-xs">
          <div className="text-center border-b border-amber-200 pb-2.5">
            <div className="font-gujarati text-sm font-bold text-amber-900">
              સ્થાયી સમિતિ ઠરાવ પત્રક (Standing Committee Resolution)
            </div>
            <div className="font-mono text-xs font-bold text-[#0E355C] mt-0.5">
              Resolution No. {doc.keyMetrics[0]?.value} · Passed Unanimously
            </div>
          </div>
          <p className="text-slate-700 text-center italic">
            &ldquo;Resolved that administrative &amp; expenditure sanction of <strong>₹ {cost.toFixed(2)} Crore</strong> is hereby accorded for {project.name} at {project.ulb}.&rdquo;
          </p>
          <div className="flex justify-around text-[11px] pt-1 font-semibold text-amber-900">
            <span>Agenda Item: #07</span>
            <span>·</span>
            <span>Outlay: ₹ {cost.toFixed(2)} Cr</span>
            <span>·</span>
            <span>Status: Sanctioned</span>
          </div>
        </div>
      );

    // 10. TECHNICAL SANCTION -> Statutory Form P.W.D. 84 Order
    case 10:
      return (
        <div className="p-4 rounded-xl border-2 border-[#0E355C] bg-white space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Form P.W.D. 84</div>
              <div className="text-sm font-extrabold text-[#0E355C]">TECHNICAL SANCTION ORDER</div>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#0E355C] text-white font-mono font-bold">
              TS: ₹ {cost.toFixed(2)} Cr
            </div>
          </div>
          <p className="text-slate-600">{doc.summaryParagraph}</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <strong>Order No:</strong> {doc.keyMetrics[0]?.value}
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <strong>Authority:</strong> Chief Engineer / CoMA
            </div>
          </div>
        </div>
      );

    // 11. TENDER DOCUMENT PREPARATION -> Draft Tender Paper (DTP) Bid Terms Grid
    case 11:
      return (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-[10px] text-blue-700 font-bold uppercase">Form Type</div>
              <div className="font-extrabold text-[#0E355C] text-sm mt-1">Form B-2</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-[10px] text-blue-700 font-bold uppercase">1% EMD Amount</div>
              <div className="font-extrabold text-[#0E355C] text-sm mt-1">₹ {(cost * 0.01).toFixed(2)} Cr</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-[10px] text-blue-700 font-bold uppercase">Time Limit</div>
              <div className="font-extrabold text-[#0E355C] text-sm mt-1">18 Months</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-[10px] text-blue-700 font-bold uppercase">Free DLP</div>
              <div className="font-extrabold text-[#0E355C] text-sm mt-1">5 Years</div>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
            <div className="font-bold text-slate-900">Pre-Qualification Criteria:</div>
            <div className="text-slate-600">• Class-AA Registration with Gujarat R&amp;B / GWSSB</div>
            <div className="text-slate-600">• Min. Average Annual Turnover: ₹ {(cost * 0.5).toFixed(2)} Cr in last 3 FYs</div>
          </div>
        </div>
      );

    // 12. e-PROCUREMENT PUBLICATION -> nProcure Bid Schedule Timeline
    case 12:
      return (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-indigo-950 text-white">
            <span className="font-bold">nProcure Gujarat e-Tender Portal</span>
            <span className="font-mono text-amber-300">{doc.keyMetrics[0]?.value}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { step: '1. NIT Live', date: '28 Jun 2026' },
              { step: '2. Pre-Bid', date: '06 Jul 2026' },
              { step: '3. Bid Close', date: '20 Jul 2026' },
              { step: '4. Tech Open', date: '21 Jul 2026' }
            ].map((t, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/40">
                <Calendar className="w-3.5 h-3.5 text-indigo-700 mx-auto mb-1" />
                <div className="font-bold text-indigo-950">{t.step}</div>
                <div className="font-mono text-[10px] text-slate-600 mt-0.5">{t.date}</div>
              </div>
            ))}
          </div>
        </div>
      );

    // 13. TECHNICAL EVALUATION -> 3-Bidder Technical Qualification Cards
    case 13:
      return (
        <div className="space-y-2.5 text-xs">
          {[
            { name: 'M/s. Shreeji Infra Projects Pvt. Ltd.', score: 94, tag: 'Qualified' },
            { name: 'M/s. Patel Urban Engineering Ltd.', score: 88, tag: 'Qualified' },
            { name: 'M/s. Suryam Epcon Construction LLP', score: 84, tag: 'Qualified' }
          ].map((b, i) => (
            <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900">{b.name}</div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-[#0E355C] rounded-full" style={{ width: `${b.score}%` }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-[#0E355C]">{b.score}/100</div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {b.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      );

    // 14. FINANCIAL EVALUATION -> L1 Lowest Bidder Podium Highlight
    case 14:
      return (
        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center">
                L1
              </span>
              <div>
                <div className="font-extrabold text-emerald-950 text-sm">M/s. Shreeji Infra Projects Pvt. Ltd.</div>
                <div className="text-emerald-800 font-medium">-3.50% Below Sanctioned SOR Estimate</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-base font-extrabold text-emerald-900">₹ {l1Cost} Cr</div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase">Lowest Responsive</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg border border-slate-200 flex justify-between">
              <span><strong>L2:</strong> M/s. Patel Urban Engg.</span>
              <span className="font-mono font-bold">₹ {(cost * 0.988).toFixed(2)} Cr (-1.2%)</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 flex justify-between">
              <span><strong>L3:</strong> M/s. Suryam Epcon LLP</span>
              <span className="font-mono font-bold">₹ {(cost * 1.015).toFixed(2)} Cr (+1.5%)</span>
            </div>
          </div>
        </div>
      );

    // 15. LOI ISSUANCE -> Formal Official Letter Correspondence
    case 15:
      return (
        <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/40 space-y-2.5 text-xs font-serif">
          <div className="flex justify-between font-sans text-[11px] text-slate-500 border-b border-slate-200 pb-2">
            <span><strong>To:</strong> M/s. Shreeji Infra Projects Pvt. Ltd.</span>
            <span><strong>LoI Ref:</strong> {doc.keyMetrics[0]?.value}</span>
          </div>
          <div className="font-sans font-bold text-[#0E355C]">
            Sub: Letter of Intent (LoI) for &ldquo;{project.name}&rdquo; at Accepted L1 Offer of ₹ {l1Cost} Cr.
          </div>
          <p className="font-sans text-slate-700 leading-relaxed">
            Your lowest financial bid of <strong>₹ {l1Cost} Crore</strong> (-3.50% below estimate) is hereby accepted. You are directed to furnish a 5% Performance Bank Guarantee of <strong>₹ {pbgAmount} Cr</strong> within 15 days to execute the Form B-2 Contract Agreement.
          </p>
        </div>
      );

    // 16. PERFORMANCE BANK GUARANTEE -> Bank Guarantee Bond Certificate
    case 16:
      return (
        <div className="p-4 rounded-xl border-2 border-blue-900 bg-blue-50/30 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#0E355C]" />
              <span className="font-bold text-[#0E355C] uppercase">State Bank of India · Performance BG Bond</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
              SFMS VERIFIED
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded bg-white border border-blue-200">
              <div className="text-[10px] text-slate-400">BG NUMBER</div>
              <div className="font-bold text-slate-900 mt-0.5">{doc.keyMetrics[0]?.value}</div>
            </div>
            <div className="p-2 rounded bg-white border border-blue-200">
              <div className="text-[10px] text-slate-400">5% SECURITY SUM</div>
              <div className="font-bold text-emerald-700 mt-0.5">₹ {pbgAmount} Cr</div>
            </div>
            <div className="p-2 rounded bg-white border border-blue-200">
              <div className="text-[10px] text-slate-400">VALID UPTO</div>
              <div className="font-bold text-slate-900 mt-0.5">31 Dec 2028</div>
            </div>
          </div>
        </div>
      );

    // 17. AGREEMENT SIGNING -> Non-Judicial Stamp Paper Deed
    case 17:
      return (
        <div className="rounded-xl border border-slate-300 overflow-hidden text-xs">
          <div className="bg-amber-900 text-amber-100 px-4 py-2 flex items-center justify-between font-mono text-[11px]">
            <span>INDIA NON JUDICIAL · GUJARAT STAMP PAPER ₹ 300</span>
            <span>DEED: {doc.keyMetrics[0]?.value}</span>
          </div>
          <div className="p-3.5 bg-amber-50/20 space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded border border-slate-200 bg-white">
                <div className="text-[10px] font-bold text-slate-400 uppercase">First Party (Employer)</div>
                <div className="font-bold text-[#0E355C]">{project.ulb}</div>
              </div>
              <div className="p-2.5 rounded border border-slate-200 bg-white">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Second Party (EPC Agency)</div>
                <div className="font-bold text-slate-900">M/s. Shreeji Infra Projects Pvt. Ltd.</div>
              </div>
            </div>
            <div className="text-slate-600">
              Contract Sum: <strong>₹ {l1Cost} Cr</strong> · Work Order Date: <strong>18 Aug 2026</strong> · Completion: <strong>17 Feb 2028</strong>
            </div>
          </div>
        </div>
      );

    // 18. SITE HANDOVER -> Joint Rojkam Panchnama Witness Box
    case 18:
      return (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#0E355C] mb-1">Joint Possession Rojkam (Panchnama)</div>
            <p className="text-slate-600">{doc.summaryParagraph}</p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {['ULB Site Engineer', 'PMC Resident Engg.', 'Ward Officer', 'Contractor PM'].map((role, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <div className="font-bold text-slate-800 text-[11px]">{role}</div>
                <div className="text-[10px] text-emerald-700 font-mono">Signed on Site</div>
              </div>
            ))}
          </div>
        </div>
      );

    // 19. DESIGN APPROVAL -> Blueprint CAD Sheet
    case 19:
      return (
        <div className="p-4 rounded-xl bg-[#0B2545] text-blue-100 font-mono text-xs space-y-3 border-2 border-blue-400/40">
          <div className="flex items-center justify-between border-b border-blue-400/30 pb-2">
            <span className="font-bold text-cyan-300">CAD BLUEPRINT · GFC DRAWING RELEASE</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 text-[10px]">
              GOOD FOR CONSTRUCTION
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {doc.tableRows.map((r, i) => (
              <div key={i} className="p-2 rounded bg-blue-950/80 border border-blue-400/25">
                <div className="text-cyan-300 font-bold">{r[0]}</div>
                <div className="font-sans text-white mt-0.5">{r[1]}</div>
              </div>
            ))}
          </div>
        </div>
      );

    // 20. CONSTRUCTION EXECUTION -> Physical Milestone Progress Bars
    case 20:
      return (
        <div className="space-y-2.5 text-xs">
          {[
            { label: '1. Earthwork & Excavation', pct: 100 },
            { label: '2. Substructure RCC (M30)', pct: 85 },
            { label: '3. Main Superstructure / Network', pct: 60 },
            { label: '4. Finishing & Hydro-Testing', pct: 25 }
          ].map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-800">{m.label}</span>
                <span className="font-mono text-[#0E355C]">{m.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.pct === 100 ? 'bg-emerald-600' : 'bg-[#0E355C]'}`}
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      );

    // 21. RFI SUBMISSION -> Pour Card & Pre-Concrete Tag
    case 21:
      return (
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200">
            <span className="font-bold text-amber-950">RFI Pour Card #{doc.keyMetrics[0]?.value}</span>
            <span className="font-mono font-bold text-emerald-700">READY FOR POUR</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {doc.tableRows.map((r, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{r[0]}</div>
                  <div className="text-[11px] text-slate-500">{r[2]}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  PASS
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    // 22. SITE INSPECTION -> TPI & NDT Quality Test gauges
    case 22:
      return (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Rebound Hammer</div>
              <div className="text-base font-extrabold text-emerald-800 font-mono mt-1">38.4 MPa</div>
              <div className="text-[10px] text-emerald-700">(&gt; 30 MPa Spec)</div>
            </div>
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Open NCRs</div>
              <div className="text-base font-extrabold text-emerald-800 font-mono mt-1">ZERO</div>
              <div className="text-[10px] text-emerald-700">100% Complied</div>
            </div>
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="text-[10px] font-bold text-slate-500 uppercase">TPI Verdict</div>
              <div className="text-base font-extrabold text-emerald-800 mt-1">CLEARED</div>
              <div className="text-[10px] text-emerald-700">Fit for Billing</div>
            </div>
          </div>
        </div>
      );

    // 23. CONTRACTOR RA BILL SUBMISSION -> GST Commercial Tax Invoice
    case 23:
      return (
        <div className="p-3.5 rounded-xl border border-slate-300 space-y-2.5 text-xs">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <div>
              <span className="font-bold text-slate-900">TAX INVOICE · RA BILL NO. 03</span>
              <span className="ml-2 font-mono text-[11px] text-slate-500">GSTIN: 24AABCS1429B1Z5</span>
            </div>
            <span className="font-mono font-bold text-sm text-[#0E355C]">₹ {raBill} Cr</span>
          </div>
          {doc.tableRows.map((r, i) => (
            <div key={i} className="flex justify-between text-slate-700">
              <span>{r[0]} — {r[1]} ({r[2]})</span>
              <span className="font-mono font-semibold">{r[3]}</span>
            </div>
          ))}
        </div>
      );

    // 24. SITE VERIFICATION CHECK -> Buff/Yellow e-Measurement Book (e-MB #412)
    case 24:
      return (
        <div className="p-4 rounded-xl bg-amber-50/70 border-2 border-amber-300 space-y-2.5 text-xs font-mono">
          <div className="flex justify-between items-center border-b border-amber-300 pb-2 font-sans">
            <span className="font-extrabold text-amber-950">ELECTRONIC MEASUREMENT BOOK · e-MB #412 (Pages 18–34)</span>
            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
              TEST-CHECKED
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-sans">
            <div className="p-2 rounded bg-white border border-amber-200">
              <div className="font-bold text-slate-900">100% Check</div>
              <div className="text-[11px] text-slate-500">Assistant Engineer</div>
            </div>
            <div className="p-2 rounded bg-white border border-amber-200">
              <div className="font-bold text-slate-900">25% Test-Check</div>
              <div className="text-[11px] text-slate-500">Dy. Exec. Engineer</div>
            </div>
            <div className="p-2 rounded bg-white border border-amber-200">
              <div className="font-bold text-slate-900">10% Super-Check</div>
              <div className="text-[11px] text-slate-500">Executive Engineer</div>
            </div>
          </div>
        </div>
      );

    // 25. PMC BILL VERIFICATION -> Waterfall Deduction Worksheet
    case 25:
      return (
        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-100 flex justify-between font-bold">
            <span>Gross Certified RA Bill-03</span>
            <span>₹ {raBill} Cr</span>
          </div>
          <div className="pl-4 space-y-1 text-rose-700">
            <div className="flex justify-between"><span>(-) 5% Security Deposit Retention</span><span>- ₹ {(Number(raBill) * 0.05).toFixed(2)} Cr</span></div>
            <div className="flex justify-between"><span>(-) 2% Income Tax TDS + 2% GST TDS</span><span>- ₹ {(Number(raBill) * 0.04).toFixed(2)} Cr</span></div>
            <div className="flex justify-between"><span>(-) 1% BOCW Labour Welfare Cess</span><span>- ₹ {(Number(raBill) * 0.01).toFixed(2)} Cr</span></div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-600 text-white flex justify-between font-bold text-sm">
            <span>NET RECOMMENDED FOR PAYMENT</span>
            <span>₹ {netPayable} Cr</span>
          </div>
        </div>
      );

    // 26. CONTRACTOR PAYMENT -> PFMS / RTGS Bank UTR Receipt
    case 26:
      return (
        <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </span>
              <div>
                <div className="font-bold text-emerald-950 text-sm">PFMS / RTGS Payment Settled</div>
                <div className="font-mono text-[11px] text-emerald-700">UTR: SBINR52026111488392014</div>
              </div>
            </div>
            <div className="text-right font-mono font-extrabold text-base text-emerald-800">
              ₹ {netPayable} Cr
            </div>
          </div>
        </div>
      );

    // 27. FINAL SITE INSPECTION -> 72-Hour Trial Run & Commissioning Scorecard
    case 27:
      return (
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {doc.tableRows.map((r, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{r[0]}</div>
                <div className="text-[11px] text-slate-500">{r[2]}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {r[3]}
              </span>
            </div>
          ))}
        </div>
      );

    // 28. PROJECT COMPLETION CERTIFICATE -> Ceremonial Double-Border Completion Certificate
    case 28:
      return (
        <div className="p-5 rounded-xl border-4 border-double border-[#0E355C] bg-slate-50/40 text-center space-y-2.5 text-xs">
          <Award className="w-7 h-7 text-amber-600 mx-auto" />
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            Certificate No. {doc.keyMetrics[0]?.value}
          </div>
          <div className="text-sm sm:text-base font-extrabold text-[#0E355C]">
            STATUTORY PROJECT COMPLETION CERTIFICATE
          </div>
          <p className="text-slate-600 max-w-lg mx-auto">
            Certified that <strong>{project.name}</strong> at <strong>{project.ulb}</strong> was physically completed on <strong>18 Jan 2028</strong> (30 days ahead of schedule) at a final cost of <strong>₹ {l1Cost} Cr</strong>.
          </p>
        </div>
      );

    // 29. PROJECT HANDOVER -> Asset Transfer & O&M Handover Flow
    case 29:
    default:
      return (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
            <div className="text-center flex-1">
              <Building2 className="w-5 h-5 text-[#0E355C] mx-auto mb-1" />
              <div className="font-bold text-slate-900">Project Execution Cell</div>
              <div className="text-[10px] text-slate-500">Handing Over Wing</div>
            </div>
            <div className="flex flex-col items-center text-[#0E355C]">
              <span className="text-[10px] font-mono font-bold">ASSET TRANSFER</span>
              <ArrowRight className="w-5 h-5" />
            </div>
            <div className="text-center flex-1">
              <Stamp className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
              <div className="font-bold text-emerald-950">Municipal O&amp;M Wing</div>
              <div className="text-[10px] text-emerald-700">Taking Over for Public Service</div>
            </div>
          </div>
          <div className="flex justify-between px-3 py-2 rounded bg-slate-100 font-mono text-[11px]">
            <span>Asset ID: {doc.keyMetrics[0]?.value}</span>
            <span>Capitalized Value: ₹ {l1Cost} Cr</span>
          </div>
        </div>
      );
  }
};
