import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// https://dev.to/quocbahuynh/build-a-multi-language-website-using-react-in-3-minutes-4206

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        // English translations
        translation: {
          // here we will place our translations...
          timesheet: {
            title: 'Timesheet',
            project: 'Project',
            client: 'Client',
            workDate: 'Date',
            workStartTime: 'Start Time',
            workEndTime: 'End Time',
            notes: 'Notes',
            notesPlaceholder: 'Enter a note',
            clockin: 'Clock-in',
            clockout: 'Clock-out',
            finalize: 'Finalize',
            submit: 'Save',
            cancel: 'Cancel',
            yes: 'Yes',
            no: 'No',
            hr0: 'Were you injured today?',
            hr1: 'Was there sufficient water today?',
            hr2: 'Did you receive your 10 minute breaks today?',
            hr3: 'Did you receive your 30 minute lunch break today?',
            hr4: 'Were you harassed due to your race, color, religious creed, sex, national origin, ancentry, sexual orientation, age, marital status, gender identity or expression, medical condition, mental or physical disability, or military and veteran status?',
            costCode: 'Cost Code',
            costCodePercentage: 'Percentage of Work'
          }
        }
      },
      es: {
        // Spanish translations
        translation: {
          timesheet: {
            title: 'Tarjeta de Checado',
            project: 'Proyecto',
            workDate: 'Fecha',
            workStartTime: 'Hora de Llegada',
            workEndTime: 'Hora de Salida',
            notes: 'Notas',
            notesPlaceholder: 'A notar',
            clockin: 'Fichar Entrada',
            clockout: 'Fichar Salida',
            finalize: 'Finalizar',
            submit: 'Enviar',
            cancel: 'Cancelar',
            yes: 'Sí',
            no: 'No',
            hr0: '¿Te lastimaste hoy?',
            hr1: '¿Hubo suficiente agua en el sitio hoy?',
            hr2: '¿Recibiste tus decansos de 10 minutos hoy?',
            hr3: '¿Recibiste tu almuerzo de 30 minutos hoy?',
            hr4: '¿Fue acosado debido a su raza, color, credo religioso, sexo, origen nacional ascendencia, orientacion sexual, edad, estado civil, identidad o expresión de género, condición médica, discapacidad mental o fisica, o estado militar o veterano?',
            costCode: 'Código de Costo',
            costCodePercentage: 'Porcentaje de Trabajo'
          }
        }
      }
    }
  });

export default i18n;