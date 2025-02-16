window.addEventListener("DOMContentLoaded", () => {
  const clock = new ProgressClock("#clock");
});

class ProgressClock {
  constructor(qs) {
    if (!qs) throw new Error("Selector is required");
    this.el = document.querySelector(qs);
    if (!this.el) throw new Error(`Element ${qs} not found`);
    this.time = 0;
    this.updateTimeout = null;
    this.ringTimeouts = [];
    this.update();
  }
  getDayOfWeek(day) {
    switch (day) {
      case 1:
        return "Lunedì";
      case 2:
        return "Martedì";
      case 3:
        return "Mercoledì";
      case 4:
        return "Giovedì";
      case 5:
        return "Venerdì";
      case 6:
        return "Sabato";
      default:
        return "Domenica";
    }
  }
  getMonthInfo(mo, yr) {
    switch (mo) {
      case 1:
        return { name: "Febbraio", days: yr % 4 === 0 ? 29 : 28 };
      case 2:
        return { name: "Marzo", days: 31 };
      case 3:
        return { name: "Aprile", days: 30 };
      case 4:
        return { name: "Maggio", days: 31 };
      case 5:
        return { name: "Giugno", days: 30 };
      case 6:
        return { name: "Luglio", days: 31 };
      case 7:
        return { name: "Agosto", days: 31 };
      case 8:
        return { name: "Settembre", days: 30 };
      case 9:
        return { name: "Ottobre", days: 31 };
      case 10:
        return { name: "Novembre", days: 30 };
      case 11:
        return { name: "Dicembre", days: 31 };
      default:
        return { name: "Gennaio", days: 31 };
    }
  }
  update() {
    this.time = new Date();

    if (this.el) {
      // data e tempo
      const dayOfWeek = this.time.getDay();
      const year = this.time.getFullYear();
      const month = this.time.getMonth();
      const day = this.time.getDate();
      const hr = this.time.getHours();
      const min = this.time.getMinutes();
      const sec = this.time.getSeconds();
      const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
      const monthInfo = this.getMonthInfo(month, year);
      const m_progress = sec / 60;
      const h_progress = (min + m_progress) / 60;
      const d_progress = (hr + h_progress) / 24;
      const mo_progress = (day - 1 + d_progress) / monthInfo.days;
      const units = [
        {
          label: "w",
          value: dayOfWeekName,
        },
        {
          label: "mo",
          value: monthInfo.name,
          progress: mo_progress,
        },
        {
          label: "d",
          value: day,
          progress: d_progress,
        },
        {
          label: "h",
          value: hr === 0 ? 12 : hr > 12 ? hr - 12 : hr,
          progress: h_progress,
        },
        {
          label: "m",
          value: min < 10 ? "0" + min : min,
          progress: m_progress,
        },
        {
          label: "s",
          value: sec < 10 ? "0" + sec : sec,
        },
        {
          label: "ap",
          value: hr > 11 ? "PM" : "AM",
        },
      ];
      // eliminare il timeout
      this.ringTimeouts.forEach((t) => {
        clearTimeout(t);
      });
      this.ringTimeouts = [];

      // aggiornarmento del display
      units.forEach((u) => {
        //anelli
        const ring = this.el.querySelector(`[data-ring="${u.label}"]`);
        const fill360 = "progress-clock__ring-fill--360"; // 'c' minuscola
        if (ring) {
          const strokeDashArray = ring.getAttribute("stroke-dasharray");
          if (strokeDashArray) {
            //calcolare la corsa
            const circumference = +strokeDashArray.split(" ")[0];
            const strokeDashOffsetPct = 1 - u.progress;

            ring.setAttribute(
              "stroke-dashoffset",
              strokeDashOffsetPct * circumference
            );
            //Aggiungere la transizione di dissolvenza, poi rimuoverla
            if (strokeDashOffsetPct === 1) {
              ring.classList.add(fill360);

              this.ringTimeouts.push(
                setTimeout(() => {
                  ring.classList.remove(fill360);
                }, 600)
              );
            }
          }
        }
        //cifre
        const unit = this.el.querySelector(`[data-unit="${u.label}"]`);
        if (unit) unit.innerText = u.value;
      });
    }
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(this.update.bind(this), 1e3);
  }

  destroy() {
    clearTimeout(this.updateTimeout);
    this.ringTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.ringTimeouts = [];
    this.el = null;
  }
}
