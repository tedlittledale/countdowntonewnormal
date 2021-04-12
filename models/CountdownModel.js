import { types, onSnapshot, flow, getSnapshot } from "mobx-state-tree";
import numeral from "numeral";
import { compose, concat } from "ramda";
import { parse, addDays, format, getDayOfYear } from "date-fns/fp";

const DataLine = types.model("DataLine", {
  date: types.string,
  newPeopleVaccinatedFirstDoseByPublishDate: types.maybeNull(types.number),
  newPeopleVaccinatedSecondDoseByPublishDate: types.maybeNull(types.number),
  cumPeopleVaccinatedFirstDoseByPublishDate: types.number,
  cumPeopleVaccinatedSecondDoseByPublishDate: types.number
});
const Marker = types.model("DataLine", {
  date: types.string,
  label: types.string,
  percentOfYear: types.number,
  isHerd: false
});
export const CountdownModel = types
  .model("TimelineModel", {
    allData: types.array(DataLine),
    sevenDayAverage: types.maybeNull(types.string),
    fourteenDayAverage: types.maybeNull(types.string),
    herdDate: types.maybeNull(types.string),
    markers: types.array(Marker),
    daysToHerd: types.maybeNull(types.number),
    currentPage: 0
  })
  .actions((self) => ({
    processData(data) {
      if (data.length === 0) {
        return;
      }
      let latestTotal,
        latestTotal2ndDose,
        lastUpdated,
        sevenDayValues = 0,
        fourteenDayValues = 0,
        sevenDayValues2ndDose = 0;

      const UKPop = 67886011;
      const ninetyPercentPop = Math.round(UKPop * 0.9);
      const eightyPercentPop = Math.round(UKPop * 0.8);
      console.log(data.length);
      const cleanData = data.map(
        (
          {
            date,
            newPeopleVaccinatedFirstDoseByPublishDate,
            newPeopleVaccinatedSecondDoseByPublishDate,
            cumPeopleVaccinatedFirstDoseByPublishDate,
            cumPeopleVaccinatedSecondDoseByPublishDate
          },
          idx
        ) => {
          if (idx === 0) {
            latestTotal = cumPeopleVaccinatedFirstDoseByPublishDate;
            latestTotal2ndDose = cumPeopleVaccinatedSecondDoseByPublishDate;
            lastUpdated = parse(new Date(), "yyyy-MM-dd", date);
          }
          if (idx <= 6) {
            sevenDayValues += newPeopleVaccinatedFirstDoseByPublishDate;
            sevenDayValues2ndDose += newPeopleVaccinatedSecondDoseByPublishDate;
          }
          if (idx <= 13) {
            fourteenDayValues += newPeopleVaccinatedFirstDoseByPublishDate;
          }
          return {
            date,
            newPeopleVaccinatedFirstDoseByPublishDate,
            newPeopleVaccinatedSecondDoseByPublishDate,
            cumPeopleVaccinatedFirstDoseByPublishDate,
            cumPeopleVaccinatedSecondDoseByPublishDate
          };
        }
      );

      const sevenDayAverage = Math.round(sevenDayValues / 7);
      const fourtheenDayAverage = Math.round(fourteenDayValues / 14);
      const sevenDayAverage2ndDose = Math.round(sevenDayValues2ndDose / 7);
      const getTargetDate = ({ targetPop, latestTotal, average }) => {
        const remaining = targetPop - latestTotal;
        const daysToTarget = Math.ceil(remaining / average);
        const addDay = compose(addDays(daysToTarget));
        return {
          date: addDay(lastUpdated),
          days: daysToTarget
        };
      };

      const { date: ninetyPercentDate } = getTargetDate({
        targetPop: ninetyPercentPop,
        latestTotal,
        average: fourtheenDayAverage
      });
      const { date: nightyPercent2ndDoseDate } = getTargetDate({
        targetPop: ninetyPercentPop,
        latestTotal: latestTotal2ndDose,
        average: sevenDayAverage2ndDose
      });
      const { date: eightyPercentDate, days: daysToHerd } = getTargetDate({
        targetPop: eightyPercentPop,
        latestTotal,
        average: fourtheenDayAverage
      });
      console.log({ nightyPercent2ndDoseDate });

      self.allData = data;
      self.daysToHerd = daysToHerd;
      self.sevenDayAverage = numeral(sevenDayAverage).format("0.0a");
      self.fourteenDayAverage = numeral(fourtheenDayAverage).format("0.0a");
      self.herdDate = format("do MMM", eightyPercentDate);
      self.markers = [
        {
          date: format("dd.MM.yyyy", lastUpdated),
          label: `Latest update - ${numeral(latestTotal).format(
            "0.0a"
          )} people have had 1st dose`,
          percentOfYear:
            Math.round(1000 * (getDayOfYear(lastUpdated) / 365)) / 1000
        },
        {
          date: format("dd.MM.yyyy", ninetyPercentDate),
          label: `90% of population will have had 1st dose`,
          percentOfYear:
            Math.round(1000 * (getDayOfYear(ninetyPercentDate) / 365)) / 1000
        },
        {
          date: format("dd.MM.yyyy", eightyPercentDate),
          label: `80% of population will have had 1st dose`,
          isHerd: true,
          percentOfYear:
            Math.round(1000 * (getDayOfYear(eightyPercentDate) / 365)) / 1000
        }
      ];
    },
    setPage(newPage) {
      self.currentPage = Math.min(2, Math.max(0, newPage));
    },
    updatePage(inc) {
      if (typeof self.timeoutId !== "number") {
        self.setPage(self.currentPage + inc);
        self.timeoutId = setTimeout(() => {
          self.timeoutId = clearTimeout(self.timeoutId);
        }, 500);
      }
    },
    afterCreate() {
      console.log(self, getSnapshot(self));
    }
  }))
  .views((self) => {
    return {
      getNodeById: (id) => {
        return id;
      }
    };
  });
