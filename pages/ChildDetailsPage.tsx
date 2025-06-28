



import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Child, GrowthRecord, Role, AnalysisRecord, Immunization, ImmunizationScheduleItem, Milestone, MilestoneCategory, MilestoneRecord, GrowthStatus, User } from '../types';
import { dataService } from '../services/dataService';
import { ALL_MILESTONES } from '../services/milestoneData';
import Card, { CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ICONS, IconComponent } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { WHO_WEIGHT_FOR_AGE_BOYS, WHO_WEIGHT_FOR_AGE_GIRLS } from '../services/whoGrowthStandards';
import { IMMUNIZATION_SCHEDULE } from '../services/immunizationSchedule';
import { getGrowthStatus, calculateAgeInMonths } from '../utils/healthUtils';
import AddGrowthRecordModal from '../components/forms/AddGrowthRecordModal';

// --- Child Details Page Components ---

const ChildDemographics: React.FC<{ child: Child }> = ({ child }) => {
    return (
        <Card>
            <CardHeader>
                <h3 className="font-bold text-lg text-slate-800">Data Diri Anak</h3>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="sm:col-span-1">
                        <dt className="font-bold text-slate-500">NIK</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{child.nik || '-'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="font-bold text-slate-500">No. Kartu Keluarga</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{child.kk || '-'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="font-bold text-slate-500">Tempat, Tanggal Lahir</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{`${child.placeOfBirth || 'N/A'}, ${new Date(child.dateOfBirth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}</dd>
                    </div>
                     <div className="sm:col-span-1">
                        <dt className="font-bold text-slate-500">Nama Ayah</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{child.fatherName || '-'}</dd>
                    </div>
                     <div className="sm:col-span-1">
                        <dt className="font-bold text-slate-500">Nama Ibu</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{child.motherName || '-'}</dd>
                    </div>
                     <div className="sm:col-span-2">
                        <dt className="font-bold text-slate-500">Alamat</dt>
                        <dd className="mt-1 text-slate-900 whitespace-pre-line font-medium">{child.address || '-'}</dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    );
};

const MilestoneTracker: React.FC<{ child: Child, onMilestoneAchieved: (record: MilestoneRecord) => void }> = ({ child, onMilestoneAchieved }) => {
    const [activeTab, setActiveTab] = useState<MilestoneCategory>(MilestoneCategory.GrossMotor);
    const achievedMilestoneIds = new Set(child.milestoneHistory.map(m => m.milestoneId));

    const handleCheckMilestone = async (milestoneId: string) => {
        if (achievedMilestoneIds.has(milestoneId)) return;

        const newRecord: MilestoneRecord = {
            milestoneId,
            achievedDate: new Date().toISOString().split('T')[0],
        };
        await dataService.addMilestoneRecord(child.id, newRecord);
        onMilestoneAchieved(newRecord);
    };

    const categoryIcons: Record<MilestoneCategory, IconComponent> = {
        [MilestoneCategory.GrossMotor]: ICONS.grossMotor,
        [MilestoneCategory.FineMotor]: ICONS.fineMotor,
        [MilestoneCategory.SocialEmotional]: ICONS.social,
        [MilestoneCategory.LanguageCommunication]: ICONS.language,
    };
    
    const categoryColors: Record<MilestoneCategory, string> = {
        [MilestoneCategory.GrossMotor]: "bg-blue-100 text-blue-600",
        [MilestoneCategory.FineMotor]: "bg-pink-100 text-pink-600",
        [MilestoneCategory.SocialEmotional]: "bg-secondary-100 text-secondary-600",
        [MilestoneCategory.LanguageCommunication]: "bg-green-100 text-green-600",
    }
    
    const TabButton: React.FC<{ category: MilestoneCategory, Icon: IconComponent }> = ({ category, Icon }) => (
        <button
            onClick={() => setActiveTab(category)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === category ? `${categoryColors[category]} shadow-md` : 'text-slate-500 hover:bg-slate-100'}`}
        >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline">{category}</span>
        </button>
    );

    return (
        <Card>
            <CardHeader>
                <h3 className="font-bold text-lg text-slate-800">Perkembangan Si Kecil</h3>
                <div className="flex gap-2 mt-4 p-1 bg-slate-50 rounded-2xl">
                    <TabButton category={MilestoneCategory.GrossMotor} Icon={ICONS.grossMotor} />
                    <TabButton category={MilestoneCategory.FineMotor} Icon={ICONS.fineMotor} />
                    <TabButton category={MilestoneCategory.SocialEmotional} Icon={ICONS.social} />
                    <TabButton category={MilestoneCategory.LanguageCommunication} Icon={ICONS.language} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {ALL_MILESTONES.filter(m => m.category === activeTab).map(milestone => {
                        const isAchieved = achievedMilestoneIds.has(milestone.id);
                        const achievedRecord = isAchieved ? child.milestoneHistory.find(m => m.milestoneId === milestone.id) : null;

                        return (
                             <div key={milestone.id} className={`flex items-start gap-4 p-4 rounded-lg transition-all ${isAchieved ? 'bg-primary-50' : 'bg-slate-50'}`}>
                                <button onClick={() => handleCheckMilestone(milestone.id)} disabled={isAchieved} className="flex-shrink-0">
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${isAchieved ? 'bg-primary-500 border-primary-500' : 'border-2 border-slate-300 hover:border-primary-400'}`}>
                                        {isAchieved && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                </button>
                                <div>
                                    <p className={`font-bold ${isAchieved ? 'text-primary-700' : 'text-slate-800'}`}>{milestone.description}</p>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {isAchieved && achievedRecord ? (
                                            <span className="flex items-center gap-1.5 text-green-600 font-bold">
                                                <ICONS.star className="w-4 h-4" /> Tercapai pada {new Date(achievedRecord.achievedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        ) : (
                                            `Normalnya di usia ${milestone.ageRangeMonths[0]}-${milestone.ageRangeMonths[1]} bulan`
                                        )}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

const GrowthChart: React.FC<{ child: Child }> = ({ child }) => {
    const whoData = child.gender === 'Laki-laki' ? WHO_WEIGHT_FOR_AGE_BOYS : WHO_WEIGHT_FOR_AGE_GIRLS;
    
    const chartData = whoData.map(standard => {
        const historyRecord = child.growthHistory.find(h => h.ageInMonths === standard.month);
        return {
            ...standard,
            'Berat Anak': historyRecord?.weight,
        };
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100">
                <p className="font-bold text-slate-800">{`Usia: ${label} bulan`}</p>
                {payload.map((pld: any) => {
                  if (pld.name.includes("Area")) return null; // Don't show area values in tooltip
                  return (
                    <p key={pld.dataKey} style={{ color: pld.stroke || pld.fill }} className="font-medium text-sm">
                        {`${pld.name}: ${pld.value ? pld.value.toFixed(2) + ' kg' : '-'}`}
                    </p>
                  )
                })}
            </div>
            );
        }
        return null;
    };

    return (
        <Card>
             <CardHeader>
                <h3 className="font-bold text-lg text-slate-800">Grafik Pertumbuhan (Berat vs Usia) - KMS Digital</h3>
                <p className="text-sm text-slate-500">Membandingkan pertumbuhan anak dengan standar WHO.</p>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorGood" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorUnder" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} unit=" bln" />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} unit=" kg" domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "14px"}}/>

                        <Area type="monotone" dataKey="p85" stackId="1" strokeWidth={0} fill="url(#colorGood)" name="Gizi Baik Area" />
                        <Area type="monotone" dataKey="p15" stackId="1" strokeWidth={0} fill="url(#colorUnder)" name="Gizi Kurang Area"/>

                        <Line type="monotone" dataKey="p3" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Batas Gizi Buruk" dot={false} />
                        <Line type="monotone" dataKey="p15" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Batas Gizi Kurang" dot={false} />
                        <Line type="monotone" dataKey="p85" stroke="#84cc16" strokeWidth={2} strokeDasharray="5 5" name="Batas Gizi Baik" dot={false}/>
                        
                        <Line type="monotone" dataKey="Berat Anak" stroke="#14b8a6" strokeWidth={3} fill="#14b8a6" dot={{ r: 6, fill: "#14b8a6" }} activeDot={{ r: 8 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

const KaderAnalysis: React.FC<{ child: Child, onAnalysisAdded: (analysis: AnalysisRecord) => void }> = ({ child, onAnalysisAdded }) => {
    const { user } = useAuth();
    const [analysisText, setAnalysisText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!analysisText.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const newAnalysis = await dataService.addAnalysisRecord(child.id, user, analysisText);
            onAnalysisAdded(newAnalysis);
            setAnalysisText('');
        } catch (error) {
            console.error("Failed to add analysis", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <h3 className="font-bold text-lg text-slate-800">Analisis Kader</h3>
                <p className="text-sm text-slate-500">Catatan dan analisis dari Bidan atau Kader Posyandu.</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {child.analysisHistory.length === 0 && user?.role !== Role.Kader && (
                    <div className="text-center py-6 px-3 bg-slate-50 rounded-2xl">
                        <p className="text-slate-500 font-medium">Belum ada analisis dari Kader.</p>
                    </div>
                )}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                    {child.analysisHistory.map(analysis => (
                        <div key={analysis.id} className="p-4 bg-primary-50/70 rounded-xl">
                            <p className="text-slate-700">{analysis.analysisText}</p>
                            <p className="text-xs text-slate-500 font-bold mt-2 text-right">
                                {analysis.kaderName} - {new Date(analysis.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
            {user?.role === Role.Kader && (
                <CardFooter>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={analysisText}
                            onChange={e => setAnalysisText(e.target.value)}
                            placeholder="Tambahkan analisis atau catatan..."
                            rows={3}
                            className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div className="flex justify-end mt-2">
                            <Button type="submit" isLoading={isSubmitting} disabled={!analysisText.trim()}>
                                Simpan Analisis
                            </Button>
                        </div>
                    </form>
                </CardFooter>
            )}
        </Card>
    );
};

const ImmunizationTracker: React.FC<{ child: Child, onImmunizationAdded: (record: Immunization) => void }> = ({ child, onImmunizationAdded }) => {
    const { user } = useAuth();
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const ageInMonths = calculateAgeInMonths(child.dateOfBirth);
    const completedImmunizations = new Set(child.immunizationHistory.map(i => i.name));

    const dueImmunizations = IMMUNIZATION_SCHEDULE.filter(item => !completedImmunizations.has(item.name) && item.dueAgeMonths <= ageInMonths);

    const getStatus = (item: ImmunizationScheduleItem): { text: string; icon: IconComponent; color: string } => {
        if (completedImmunizations.has(item.name)) {
            return { text: 'Selesai', icon: ICONS.star, color: 'text-green-500' };
        }
        if (item.dueAgeMonths <= ageInMonths) {
            return { text: 'Terlewat / Jadwalnya', icon: ICONS.alertTriangle, color: 'text-red-500' };
        }
        return { text: 'Akan Datang', icon: ICONS.clock, color: 'text-secondary-500' };
    };

    const handleAddImmunization = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVaccine) return;

        setIsSubmitting(true);
        try {
            const newRecord = { name: selectedVaccine, date: new Date().toISOString().split('T')[0] };
            const addedRecord = await dataService.addImmunizationRecord(child.id, newRecord);
            onImmunizationAdded(addedRecord);
            setSelectedVaccine('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <h3 className="font-bold text-lg text-slate-800">Riwayat & Jadwal Imunisasi</h3>
            </CardHeader>
            <CardContent>
                 <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {IMMUNIZATION_SCHEDULE.map(item => {
                        const status = getStatus(item);
                        const record = child.immunizationHistory.find(i => i.name === item.name);
                        return (
                            <div key={item.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className={`w-6 h-6 flex-shrink-0 ${status.color}`}>
                                    <status.icon/>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Jadwal: {item.dueAgeMonths === 0 ? 'Saat Lahir' : `Usia ${item.dueAgeMonths} bulan`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${status.color}`}>{status.text}</p>
                                    {record && (
                                        <p className="text-xs text-slate-400 font-medium">
                                            {new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
            {user?.role === Role.Kader && dueImmunizations.length > 0 && (
                <CardFooter>
                    <form onSubmit={handleAddImmunization} className="flex flex-col sm:flex-row gap-2">
                        <select
                            value={selectedVaccine}
                            onChange={e => setSelectedVaccine(e.target.value)}
                            className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50 flex-grow"
                        >
                            <option value="" disabled>Pilih imunisasi yang diberikan</option>
                            {dueImmunizations.map(item => (
                                <option key={item.name} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                        <Button type="submit" isLoading={isSubmitting} disabled={!selectedVaccine} className="sm:w-auto w-full">
                            + Catat
                        </Button>
                    </form>
                </CardFooter>
            )}
        </Card>
    );
};

const GrowthStatusLabel: React.FC<{status: GrowthStatus}> = ({status}) => {
    const statusStyles: Record<GrowthStatus, string> = {
        [GrowthStatus.Unknown]: 'bg-slate-200 text-slate-700',
        [GrowthStatus.SevereUnderweight]: 'bg-red-200 text-red-800',
        [GrowthStatus.Underweight]: 'bg-yellow-200 text-yellow-800',
        [GrowthStatus.Good]: 'bg-green-200 text-green-800',
        [GrowthStatus.OverweightRisk]: 'bg-orange-200 text-orange-800',
    }
    return (
        <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${statusStyles[status]}`}>
            Status Gizi: {status}
        </span>
    )
}

const ChildDetailsPage: React.FC = () => {
    const { childId } = useParams<{ childId: string }>();
    const { user } = useAuth();
    const [child, setChild] = useState<Child | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isGrowthModalOpen, setIsGrowthModalOpen] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const chartRef = useRef<HTMLDivElement>(null);


    const handlePrint = async () => {
        if (!child) return;
        const chartElement = chartRef.current;
        if (!chartElement) {
            alert("Grafik tidak ditemukan untuk dicetak.");
            return;
        }

        setIsPrinting(true);
        try {
            // 1. Capture the chart as an image
            const canvas = await html2canvas(chartElement, { scale: 2 });
            const chartImgData = canvas.toDataURL('image/png');

            // 2. Initialize jsPDF
            const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
            const pageHeight = doc.internal.pageSize.getHeight();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 40;
            let finalY = 0; // Keep track of the last Y position

            // 3. Draw Header
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Laporan Kesehatan Anak', margin, margin);
            finalY = margin + 10;
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`${child.name} (${child.gender}, ${calculateAgeInMonths(child.dateOfBirth)} bulan)`, margin, finalY + 15);
            finalY += 30;
            doc.line(margin, finalY, pageWidth - margin, finalY);
            finalY += 20;

            // 4. Add Chart Image
            const imgProps = doc.getImageProperties(chartImgData);
            const chartWidth = pageWidth - margin * 2;
            const chartHeight = (imgProps.height * chartWidth) / imgProps.width;
            doc.addImage(chartImgData, 'PNG', margin, finalY, chartWidth, chartHeight);
            finalY += chartHeight + 20;
            
            // --- Helper to draw section titles ---
            const drawSectionTitle = (title: string) => {
                if (finalY > pageHeight - 100) { // Check if space is enough for title + some content
                    doc.addPage();
                    finalY = margin;
                }
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text(title, margin, finalY);
                finalY += 20;
            }

            // 5. Draw Tables using jspdf-autotable
            const headStyles = { fillColor: '#14b8a6', textColor: 255, fontStyle: 'bold' as const };
            const alternateRowStyles = { fillColor: '#f0fdfa' };

            // Growth History Table
            if(child.growthHistory.length > 0){
                drawSectionTitle('Riwayat Pertumbuhan');
                autoTable(doc, {
                    startY: finalY,
                    head: [['Tanggal', 'Usia (bln)', 'Berat (kg)', 'Tinggi (cm)', 'L. Kepala (cm)']],
                    body: [...child.growthHistory].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(r => [
                        new Date(r.date).toLocaleDateString('id-ID'),
                        r.ageInMonths, r.weight, r.height, r.headCircumference
                    ]),
                    headStyles, alternateRowStyles, theme: 'grid'
                });
                finalY = (doc as any).lastAutoTable.finalY + 20;
            }

            // Immunization Table
            drawSectionTitle('Riwayat Imunisasi');
            autoTable(doc, {
                startY: finalY,
                head: [['Nama Imunisasi', 'Tanggal Diberikan', 'Jadwal Seharusnya']],
                body: IMMUNIZATION_SCHEDULE.map(item => {
                    const record = child.immunizationHistory.find(i => i.name === item.name);
                    return [
                        item.name,
                        record ? new Date(record.date).toLocaleDateString('id-ID') : 'Belum Diberikan',
                        item.dueAgeMonths === 0 ? 'Saat Lahir' : `${item.dueAgeMonths} bulan`
                    ];
                }),
                headStyles, alternateRowStyles, theme: 'grid'
            });
            finalY = (doc as any).lastAutoTable.finalY + 20;

            // Milestone Table
            if(child.milestoneHistory.length > 0){
                drawSectionTitle('Tonggak Perkembangan (Milestones)');
                autoTable(doc, {
                    startY: finalY,
                    head: [['Pencapaian', 'Kategori', 'Tanggal Tercapai']],
                    body: child.milestoneHistory.map(record => {
                        const milestone = ALL_MILESTONES.find(m => m.id === record.milestoneId);
                        return [ milestone?.description || record.milestoneId, milestone?.category || '-', new Date(record.achievedDate).toLocaleDateString('id-ID') ];
                    }),
                    headStyles, alternateRowStyles, theme: 'grid'
                });
                finalY = (doc as any).lastAutoTable.finalY + 20;
            }
            
            // Analysis Table
            if(child.analysisHistory.length > 0){
                drawSectionTitle('Catatan & Analisis Kader');
                autoTable(doc, {
                    startY: finalY,
                    head: [['Tanggal', 'Analisis']],
                    body: child.analysisHistory.map(r => [
                        new Date(r.date).toLocaleDateString('id-ID'),
                        `${r.analysisText} (Oleh: ${r.kaderName})`
                    ]),
                    headStyles, alternateRowStyles, theme: 'grid',
                    columnStyles: { 1: { cellWidth: 350 } }
                });
                finalY = (doc as any).lastAutoTable.finalY + 20;
            }

            // 6. Save the PDF
            doc.save(`laporan-kesehatan-${child.name.replace(/ /g, '-')}.pdf`);

        } catch(e) {
            console.error("Error generating PDF:", e);
            alert("Gagal membuat laporan PDF.");
        } finally {
            setIsPrinting(false);
        }
    };
    
    useEffect(() => {
        if (!childId) {
            setError('Child ID is missing.');
            setLoading(false);
            return;
        }

        const fetchChildData = async () => {
            try {
                const childData = await dataService.getChildById(childId);
                if (childData) {
                    setChild(childData);
                } else {
                    setError('Anak tidak ditemukan.');
                }
            } catch (err) {
                setError('Gagal memuat data anak.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChildData();
    }, [childId]);
    
    // Handler functions to update state when new data is added
    const handleStateUpdate = <T, K extends keyof Child>(key: K, newData: T) => {
        setChild(prevChild => {
            if (!prevChild) return null;
            const newHistory = [newData, ...(prevChild[key] as any[])];
            // Sort by date to ensure consistency
            if (key === 'growthHistory') {
                 (newHistory as GrowthRecord[]).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            }
            return { ...prevChild, [key]: newHistory };
        });
    };

    const handleGrowthRecordAdded = (newRecord: GrowthRecord) => {
        handleStateUpdate('growthHistory', newRecord);
        setIsGrowthModalOpen(false);
    }
    const handleMilestoneUpdate = (newRecord: MilestoneRecord) => {
        handleStateUpdate('milestoneHistory', newRecord);
    }
    const handleAnalysisUpdate = (newRecord: AnalysisRecord) => {
        handleStateUpdate('analysisHistory', newRecord);
    }
    const handleImmunizationUpdate = (newRecord: Immunization) => {
        handleStateUpdate('immunizationHistory', newRecord);
    }
    
    const handleGrowthRecordDeleted = (recordId: string) => {
        setChild(prevChild => {
            if (!prevChild) return null;
            const updatedHistory = prevChild.growthHistory.filter(r => r.id !== recordId);
            return { ...prevChild, growthHistory: updatedHistory };
        });
    }
    
    const handleDeleteGrowthRecord = async (recordId: string) => {
        if (!child) return;
        if (window.confirm(`Apakah Anda yakin ingin menghapus catatan pertumbuhan ini? Aksi ini tidak dapat dibatalkan.`)) {
            try {
                await dataService.deleteGrowthRecord(child.id, recordId);
                handleGrowthRecordDeleted(recordId);
            } catch (error) {
                console.error("Failed to delete growth record", error);
                alert("Gagal menghapus catatan pertumbuhan.");
            }
        }
    };

    if (loading) return <div className="text-center p-8">Memuat data detail anak...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;
    if (!child) return <div className="text-center p-8">Data anak tidak tersedia.</div>;

    const ageInMonths = calculateAgeInMonths(child.dateOfBirth);
    const growthStatus = getGrowthStatus(child);
    const ChildAvatar = child.gender === 'Laki-laki' ? ICONS.babyBoy : ICONS.babyGirl;
    const accentColor = child.gender === 'Laki-laki' ? 'text-blue-500' : 'text-pink-500';
    const accentBg = child.gender === 'Laki-laki' ? 'bg-blue-100' : 'bg-pink-100';

    return (
        <>
        <AddGrowthRecordModal 
            isOpen={isGrowthModalOpen}
            onClose={() => setIsGrowthModalOpen(false)}
            onSave={handleGrowthRecordAdded}
            childId={child.id}
        />
        <div className="space-y-8">
            {/* --- Back Button & Header --- */}
            <div>
                 <Button as={Link} to="/" variant="ghost" className="mb-4 text-sm !pl-0">
                    &larr; Kembali ke Dashboard
                </Button>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                     <div className={`w-16 h-16 md:w-20 md:h-20 p-2 rounded-2xl md:rounded-3xl shrink-0 ${accentBg} ${accentColor}`}>
                        <ChildAvatar className="w-full h-full" />
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">{child.name}</h1>
                        <p className={`text-base md:text-lg font-bold ${accentColor}`}>{ageInMonths} bulan • {child.gender}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center self-stretch sm:self-center">
                        {growthStatus !== GrowthStatus.Unknown && <div className="mt-2 sm:mt-0"><GrowthStatusLabel status={growthStatus} /></div>}
                        <Button variant="secondary" onClick={handlePrint} isLoading={isPrinting} className="h-full">
                            <ICONS.download className="w-5 h-5 mr-2"/> Cetak Laporan
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- Main Grid Layout --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* --- Left Column --- */}
                <div className="lg:col-span-2 space-y-8">
                    <ChildDemographics child={child} />
                    <div ref={chartRef}>
                        <GrowthChart child={child} />
                    </div>
                    <KaderAnalysis child={child} onAnalysisAdded={handleAnalysisUpdate} />
                </div>
                {/* --- Right Column --- */}
                <div className="lg:col-span-1 space-y-8">
                     <MilestoneTracker child={child} onMilestoneAchieved={handleMilestoneUpdate} />
                     <ImmunizationTracker child={child} onImmunizationAdded={handleImmunizationUpdate} />
                </div>
            </div>

            {/* --- Growth History Table --- */}
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Riwayat Pertumbuhan</h3>
                        {user?.role === Role.Kader && (
                            <Button size="sm" variant="ghost" onClick={() => setIsGrowthModalOpen(true)}>
                                <ICONS.plusCircle className="w-5 h-5 mr-1.5" />
                                Tambah Catatan
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <div className="overflow-x-auto p-2">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Usia</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Berat (kg)</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tinggi (cm)</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">L. Kepala (cm)</th>
                                {user?.role === Role.Kader && <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {child.growthHistory.map((record, index) => (
                                <tr key={record.id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-primary-50/50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">{new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{record.ageInMonths} bulan</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{record.weight}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{record.height}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{record.headCircumference}</td>
                                    {user?.role === Role.Kader && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="!text-red-500 hover:!bg-red-100 p-2" 
                                                onClick={() => handleDeleteGrowthRecord(record.id)}
                                                title="Hapus catatan"
                                            >
                                                <ICONS.trash className="w-4 h-4"/>
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {child.growthHistory.length === 0 && <p className="text-center py-8 text-slate-500">Belum ada riwayat pertumbuhan yang dicatat.</p>}
                </div>
            </Card>
        </div>
        </>
    );
};

export default ChildDetailsPage;
