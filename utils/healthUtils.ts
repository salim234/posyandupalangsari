import { Child, GrowthStatus, ImmunizationStatus, WhoGrowthStandard } from "../types";
import { WHO_WEIGHT_FOR_AGE_BOYS, WHO_WEIGHT_FOR_AGE_GIRLS } from "../services/whoGrowthStandards";
import { IMMUNIZATION_SCHEDULE } from "../services/immunizationSchedule";


export const calculateAgeInMonths = (dob: string, onDate?: string): number => {
    const birthDate = new Date(dob);
    const endDate = onDate ? new Date(onDate) : new Date();
    let months = (endDate.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += endDate.getMonth();
    
    if (endDate.getDate() < birthDate.getDate()) {
        months--;
    }

    return months <= 0 ? 0 : months;
};


export const getGrowthStatus = (child: Child): GrowthStatus => {
    if (child.growthHistory.length === 0) {
        return GrowthStatus.Unknown;
    }

    // Assuming history is sorted, but let's sort just in case.
    const latestRecord = [...child.growthHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const age = latestRecord.ageInMonths;
    const weight = latestRecord.weight;

    const whoData = child.gender === 'Laki-laki' ? WHO_WEIGHT_FOR_AGE_BOYS : WHO_WEIGHT_FOR_AGE_GIRLS;

    // Find the closest standard data for the child's age
    const standard = whoData.reduce((prev, curr) => {
        return (Math.abs(curr.month - age) < Math.abs(prev.month - age) ? curr : prev);
    });

    if (weight < standard.p3) {
        return GrowthStatus.SevereUnderweight;
    } else if (weight >= standard.p3 && weight < standard.p15) {
        return GrowthStatus.Underweight;
    } else if (weight >= standard.p15 && weight <= standard.p85) {
        return GrowthStatus.Good;
    } else if (weight > standard.p85) {
        return GrowthStatus.OverweightRisk;
    }

    return GrowthStatus.Unknown;
}

export const getImmunizationStatus = (child: Child): ImmunizationStatus => {
    const ageInMonths = calculateAgeInMonths(child.dateOfBirth);
    const completedImmunizations = new Set(child.immunizationHistory.map(i => i.name));

    const missed = IMMUNIZATION_SCHEDULE.find(item => {
        return item.dueAgeMonths <= ageInMonths && !completedImmunizations.has(item.name);
    });

    return missed ? ImmunizationStatus.Incomplete : ImmunizationStatus.Complete;
}
