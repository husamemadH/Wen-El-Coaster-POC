import { Route } from '@/types';

/**
 * Hand-drawn approximate polylines for coaster tracks around Amman.
 * Coordinates are illustrative — good enough for a demo, not survey-grade.
 * Every track terminates at (or near) Al-Abdali / Downtown, matching how
 * real coaster lines feed into the Amman core.
 */
export const ROUTES: Route[] = [
  {
    id: 'uoj',
    nameEn: 'University of Jordan',
    nameAr: 'الجامعة الأردنية',
    color: '#1F6FEB',
    path: [
      { lat: 32.0125, lng: 35.8737 }, // UoJ north gate
      { lat: 32.0091, lng: 35.8709 },
      { lat: 32.0032, lng: 35.8686 },
      { lat: 31.9982, lng: 35.8712 }, // Sports City
      { lat: 31.9925, lng: 35.8756 },
      { lat: 31.9863, lng: 35.8805 },
      { lat: 31.9801, lng: 35.8862 }, // Shmeisani
      { lat: 31.9752, lng: 35.8931 },
      { lat: 31.9706, lng: 35.9015 }, // Abdali
      { lat: 31.9672, lng: 35.9082 }, // Downtown
    ],
    stops: [
      { name: 'UoJ North Gate', nameAr: 'البوابة الشمالية', point: { lat: 32.0125, lng: 35.8737 } },
      { name: 'Sports City', nameAr: 'المدينة الرياضية', point: { lat: 31.9982, lng: 35.8712 } },
      { name: 'Shmeisani', nameAr: 'الشميساني', point: { lat: 31.9801, lng: 35.8862 } },
      { name: 'Abdali', nameAr: 'العبدلي', point: { lat: 31.9706, lng: 35.9015 } },
      { name: 'Downtown', nameAr: 'وسط البلد', point: { lat: 31.9672, lng: 35.9082 } },
    ],
  },
  {
    id: 'sweileh',
    nameEn: 'Sweileh',
    nameAr: 'صويلح',
    color: '#F59E0B',
    path: [
      { lat: 32.0287, lng: 35.8352 }, // Sweileh circle
      { lat: 32.0225, lng: 35.8451 },
      { lat: 32.0159, lng: 35.8557 },
      { lat: 32.0088, lng: 35.8672 },
      { lat: 32.0002, lng: 35.8768 },
      { lat: 31.9917, lng: 35.8855 },
      { lat: 31.9824, lng: 35.8934 },
      { lat: 31.9738, lng: 35.9006 },
      { lat: 31.9672, lng: 35.9082 },
    ],
    stops: [
      { name: 'Sweileh Circle', nameAr: 'دوار صويلح', point: { lat: 32.0287, lng: 35.8352 } },
      { name: 'Jubeiha', nameAr: 'الجبيهة', point: { lat: 32.0159, lng: 35.8557 } },
      { name: '8th Circle', nameAr: 'الدوار الثامن', point: { lat: 32.0002, lng: 35.8768 } },
      { name: 'Downtown', nameAr: 'وسط البلد', point: { lat: 31.9672, lng: 35.9082 } },
    ],
  },
  {
    id: 'baqaa',
    nameEn: 'Baqaa',
    nameAr: 'البقعة',
    color: '#8B5CF6',
    path: [
      { lat: 32.0644, lng: 35.8341 }, // Baqaa camp
      { lat: 32.0552, lng: 35.8402 },
      { lat: 32.0461, lng: 35.8471 },
      { lat: 32.0362, lng: 35.8548 },
      { lat: 32.0267, lng: 35.8631 },
      { lat: 32.0175, lng: 35.8722 },
      { lat: 32.0075, lng: 35.8821 },
      { lat: 31.9963, lng: 35.8912 },
      { lat: 31.9842, lng: 35.8981 },
      { lat: 31.9736, lng: 35.9038 },
      { lat: 31.9672, lng: 35.9082 },
    ],
    stops: [
      { name: 'Baqaa Camp', nameAr: 'مخيم البقعة', point: { lat: 32.0644, lng: 35.8341 } },
      { name: 'Ain Al Basha', nameAr: 'عين الباشا', point: { lat: 32.0461, lng: 35.8471 } },
      { name: 'Sweileh Junction', nameAr: 'تقاطع صويلح', point: { lat: 32.0267, lng: 35.8631 } },
      { name: 'Downtown', nameAr: 'وسط البلد', point: { lat: 31.9672, lng: 35.9082 } },
    ],
  },
  {
    id: 'zarqa',
    nameEn: 'Sweileh → Zarqa New Bus Station',
    nameAr: 'صويلح — المجمع الجديد بالزرقاء',
    color: '#E5484D',
    path: [
      { lat: 32.0287, lng: 35.8352 }, // Sweileh Circle
      { lat: 32.0225, lng: 35.8478 }, // Jubeiha
      { lat: 32.0210, lng: 35.8700 }, // Shafa Badran junction
      { lat: 32.0195, lng: 35.9020 }, // Airport Highway on-ramp
      { lat: 32.0158, lng: 35.9450 }, // Marka North
      { lat: 32.0102, lng: 35.9830 }, // Autostrad Zarqa
      { lat: 32.0110, lng: 36.0180 }, // Ruseifa west
      { lat: 32.0175, lng: 36.0470 }, // Ruseifa
      { lat: 32.0350, lng: 36.0621 }, // Ruseifa east
      { lat: 32.0568, lng: 36.0779 }, // Zarqa west
      { lat: 32.0722, lng: 36.0872 }, // Zarqa downtown
      { lat: 32.0866, lng: 36.0891 }, // Zarqa New Bus Station
    ],
    stops: [
      { name: 'Sweileh Circle', nameAr: 'دوار صويلح', point: { lat: 32.0287, lng: 35.8352 } },
      { name: 'Jubeiha', nameAr: 'الجبيهة', point: { lat: 32.0225, lng: 35.8478 } },
      { name: 'Autostrad Zarqa', nameAr: 'أوتوستراد الزرقاء', point: { lat: 32.0102, lng: 35.9830 } },
      { name: 'Ruseifa', nameAr: 'الرصيفة', point: { lat: 32.0175, lng: 36.0470 } },
      { name: 'Zarqa Downtown', nameAr: 'وسط الزرقاء', point: { lat: 32.0722, lng: 36.0872 } },
      { name: 'New Bus Station', nameAr: 'المجمع الجديد', point: { lat: 32.0866, lng: 36.0891 } },
    ],
  },
  {
    id: 'jarash',
    nameEn: 'Jarash',
    nameAr: 'جرش',
    color: '#12B76A',
    path: [
      { lat: 32.2811, lng: 35.8998 }, // Jarash town
      { lat: 32.2521, lng: 35.8951 },
      { lat: 32.2205, lng: 35.8912 },
      { lat: 32.1832, lng: 35.8877 },
      { lat: 32.1495, lng: 35.8859 },
      { lat: 32.1152, lng: 35.8842 },
      { lat: 32.0812, lng: 35.8877 },
      { lat: 32.0508, lng: 35.8934 },
      { lat: 32.0241, lng: 35.8988 },
      { lat: 31.9982, lng: 35.9042 },
      { lat: 31.9782, lng: 35.9068 },
      { lat: 31.9672, lng: 35.9082 }, // Downtown terminal
    ],
    stops: [
      { name: 'Jarash Town', nameAr: 'مدينة جرش', point: { lat: 32.2811, lng: 35.8998 } },
      { name: 'Souf', nameAr: 'سوف', point: { lat: 32.2205, lng: 35.8912 } },
      { name: 'Sakhra', nameAr: 'الصخرة', point: { lat: 32.1152, lng: 35.8842 } },
      { name: 'North Terminal', nameAr: 'المجمع الشمالي', point: { lat: 32.0241, lng: 35.8988 } },
      { name: 'Downtown', nameAr: 'وسط البلد', point: { lat: 31.9672, lng: 35.9082 } },
    ],
  },
];

export const routeById = (id: string) => ROUTES.find((r) => r.id === id);
