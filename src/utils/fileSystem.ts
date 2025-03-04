
import { 
  Folder, 
  File, 
  FileText, 
  BarChart2, 
  Users, 
  FileSpreadsheet, 
  Calendar, 
  DollarSign, 
  Truck, 
  Building, 
  Map, 
  Activity, 
  Image 
} from 'lucide-react';

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  dateCreated?: string;
  size?: string;
  icon?: any;
}

export interface FileData {
  name: string;
  path: string;
  dateCreated?: string;
  size?: string;
  content?: string;
}

export interface Statistics {
  totalBookings: number;
  totalFiles: number;
  channelDistribution: {
    JVTO: number;
    Klook: number;
    TWT: number;
  };
}

// Directory structure
export const fileSystem: Record<string, FileItem[]> = {
  '/': [
    { name: 'order_channels', type: 'folder', path: '/order_channels' },
    { name: 'reports', type: 'folder', path: '/reports' },
    { name: 'shared_resources', type: 'folder', path: '/shared_resources' }
  ],
  '/order_channels': [
    { name: 'JVTO', type: 'folder', path: '/order_channels/JVTO' },
    { name: 'Klook', type: 'folder', path: '/order_channels/Klook' },
    { name: 'TWT', type: 'folder', path: '/order_channels/TWT' }
  ],
  '/order_channels/JVTO': [
    { name: 'bookings', type: 'folder', path: '/order_channels/JVTO/bookings' },
    { name: 'schedules', type: 'folder', path: '/order_channels/JVTO/schedules' },
    { name: 'invoices', type: 'folder', path: '/order_channels/JVTO/invoices' },
    { name: 'expenses', type: 'folder', path: '/order_channels/JVTO/expenses' },
    { name: 'crew_vehicle_assignments', type: 'folder', path: '/order_channels/JVTO/crew_vehicle_assignments' }
  ],
  '/order_channels/JVTO/bookings': [
    { name: 'booking_peinee_tong_070225.pdf', type: 'file', path: '/order_channels/JVTO/bookings/booking_peinee_tong_070225.pdf', dateCreated: '2025-02-07', size: '1.2 MB' },
    { name: 'booking_john_doe_080325.pdf', type: 'file', path: '/order_channels/JVTO/bookings/booking_john_doe_080325.pdf', dateCreated: '2025-03-08', size: '1.1 MB' }
  ],
  '/order_channels/JVTO/schedules': [
    { name: 'schedule_070225_peinee_tong.pdf', type: 'file', path: '/order_channels/JVTO/schedules/schedule_070225_peinee_tong.pdf', dateCreated: '2025-02-07', size: '0.8 MB' },
    { name: 'schedule_080325_john_doe.pdf', type: 'file', path: '/order_channels/JVTO/schedules/schedule_080325_john_doe.pdf', dateCreated: '2025-03-08', size: '0.7 MB' }
  ],
  '/order_channels/JVTO/invoices': [
    { name: 'invoice_peinee_tong_JVTO862.pdf', type: 'file', path: '/order_channels/JVTO/invoices/invoice_peinee_tong_JVTO862.pdf', dateCreated: '2025-02-07', size: '0.5 MB' },
    { name: 'invoice_john_doe_JVTO863.pdf', type: 'file', path: '/order_channels/JVTO/invoices/invoice_john_doe_JVTO863.pdf', dateCreated: '2025-03-08', size: '0.6 MB' }
  ],
  '/order_channels/JVTO/expenses': [
    { name: 'expense_070225_peinee_tong.pdf', type: 'file', path: '/order_channels/JVTO/expenses/expense_070225_peinee_tong.pdf', dateCreated: '2025-02-07', size: '0.4 MB' },
    { name: 'expense_080325_john_doe.pdf', type: 'file', path: '/order_channels/JVTO/expenses/expense_080325_john_doe.pdf', dateCreated: '2025-03-08', size: '0.5 MB' }
  ],
  '/order_channels/JVTO/crew_vehicle_assignments': [
    { name: 'crew_vehicle_070225_peinee_tong.pdf', type: 'file', path: '/order_channels/JVTO/crew_vehicle_assignments/crew_vehicle_070225_peinee_tong.pdf', dateCreated: '2025-02-07', size: '0.3 MB' },
    { name: 'crew_vehicle_080325_john_doe.pdf', type: 'file', path: '/order_channels/JVTO/crew_vehicle_assignments/crew_vehicle_080325_john_doe.pdf', dateCreated: '2025-03-08', size: '0.3 MB' }
  ],
  '/order_channels/Klook': [
    { name: 'bookings', type: 'folder', path: '/order_channels/Klook/bookings' },
    { name: 'schedules', type: 'folder', path: '/order_channels/Klook/schedules' },
    { name: 'invoices', type: 'folder', path: '/order_channels/Klook/invoices' },
    { name: 'expenses', type: 'folder', path: '/order_channels/Klook/expenses' },
    { name: 'crew_vehicle_assignments', type: 'folder', path: '/order_channels/Klook/crew_vehicle_assignments' }
  ],
  '/order_channels/Klook/bookings': [
    { name: 'booking_example_klook_client.pdf', type: 'file', path: '/order_channels/Klook/bookings/booking_example_klook_client.pdf', dateCreated: '2025-03-10', size: '1.3 MB' }
  ],
  '/order_channels/Klook/schedules': [
    { name: 'schedule_example_klook_client.pdf', type: 'file', path: '/order_channels/Klook/schedules/schedule_example_klook_client.pdf', dateCreated: '2025-03-10', size: '0.9 MB' }
  ],
  '/order_channels/Klook/invoices': [
    { name: 'invoice_example_klook_client_KLOOK123.pdf', type: 'file', path: '/order_channels/Klook/invoices/invoice_example_klook_client_KLOOK123.pdf', dateCreated: '2025-03-10', size: '0.7 MB' }
  ],
  '/order_channels/Klook/expenses': [
    { name: 'expense_example_klook_client.pdf', type: 'file', path: '/order_channels/Klook/expenses/expense_example_klook_client.pdf', dateCreated: '2025-03-10', size: '0.5 MB' }
  ],
  '/order_channels/Klook/crew_vehicle_assignments': [
    { name: 'crew_vehicle_example_klook_client.pdf', type: 'file', path: '/order_channels/Klook/crew_vehicle_assignments/crew_vehicle_example_klook_client.pdf', dateCreated: '2025-03-10', size: '0.4 MB' }
  ],
  '/order_channels/TWT': [
    { name: 'bookings', type: 'folder', path: '/order_channels/TWT/bookings' },
    { name: 'schedules', type: 'folder', path: '/order_channels/TWT/schedules' },
    { name: 'invoices', type: 'folder', path: '/order_channels/TWT/invoices' },
    { name: 'expenses', type: 'folder', path: '/order_channels/TWT/expenses' },
    { name: 'crew_vehicle_assignments', type: 'folder', path: '/order_channels/TWT/crew_vehicle_assignments' }
  ],
  '/reports': [
    { name: 'financial_reports', type: 'folder', path: '/reports/financial_reports' },
    { name: 'customer_statistics', type: 'folder', path: '/reports/customer_statistics' }
  ],
  '/reports/financial_reports': [
    { name: 'financial_report_march-2025.xlsx', type: 'file', path: '/reports/financial_reports/financial_report_march-2025.xlsx', dateCreated: '2025-03-31', size: '2.5 MB' },
    { name: 'financial_report_february-2025.xlsx', type: 'file', path: '/reports/financial_reports/financial_report_february-2025.xlsx', dateCreated: '2025-02-28', size: '2.3 MB' }
  ],
  '/reports/customer_statistics': [
    { name: 'customer_statistics_march-2025.xlsx', type: 'file', path: '/reports/customer_statistics/customer_statistics_march-2025.xlsx', dateCreated: '2025-03-31', size: '1.8 MB' }
  ],
  '/shared_resources': [
    { name: 'accommodations', type: 'folder', path: '/shared_resources/accommodations' },
    { name: 'destinations', type: 'folder', path: '/shared_resources/destinations' },
    { name: 'activities', type: 'folder', path: '/shared_resources/activities' },
    { name: 'assets', type: 'folder', path: '/shared_resources/assets' }
  ]
};

// Helper function to get icon for file/folder
export const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') {
    switch (item.name) {
      case 'bookings':
        return FileText;
      case 'schedules':
        return Calendar;
      case 'invoices':
        return DollarSign;
      case 'expenses':
        return DollarSign;
      case 'crew_vehicle_assignments':
        return Truck;
      case 'financial_reports':
        return BarChart2;
      case 'customer_statistics':
        return Users;
      case 'accommodations':
        return Building;
      case 'destinations':
        return Map;
      case 'activities':
        return Activity;
      case 'assets':
        return Image;
      default:
        return Folder;
    }
  } else {
    if (item.name.endsWith('.pdf')) {
      return FileText;
    } else if (item.name.endsWith('.xlsx')) {
      return FileSpreadsheet;
    } else {
      return File;
    }
  }
};

// Helper function to get icon color for file/folder
export const getIconColor = (item: FileItem): string => {
  if (item.type === 'folder') {
    switch (item.name) {
      case 'bookings':
        return 'text-blue-500';
      case 'schedules':
        return 'text-green-500';
      case 'invoices':
        return 'text-red-500';
      case 'expenses':
        return 'text-orange-500';
      case 'crew_vehicle_assignments':
        return 'text-purple-500';
      case 'financial_reports':
        return 'text-indigo-500';
      case 'customer_statistics':
        return 'text-pink-500';
      case 'accommodations':
        return 'text-yellow-500';
      case 'destinations':
        return 'text-cyan-500';
      case 'activities':
        return 'text-lime-500';
      case 'assets':
        return 'text-fuchsia-500';
      default:
        return 'text-amber-500';
    }
  } else {
    if (item.name.endsWith('.pdf')) {
      return 'text-red-500';
    } else if (item.name.endsWith('.xlsx')) {
      return 'text-green-600';
    } else {
      return 'text-gray-500';
    }
  }
};

// Calculate statistics from file system
export const calculateStatistics = (): Statistics => {
  let bookingCount = 0;
  let totalFileCount = 0;
  let channelFiles = { JVTO: 0, Klook: 0, TWT: 0 };
  
  Object.keys(fileSystem).forEach(path => {
    fileSystem[path].forEach(item => {
      if (item.type === 'file') {
        totalFileCount++;
        
        // Count by channel
        if (path.includes('/JVTO/')) {
          channelFiles.JVTO++;
        } else if (path.includes('/Klook/')) {
          channelFiles.Klook++;
        } else if (path.includes('/TWT/')) {
          channelFiles.TWT++;
        }
        
        // Count bookings
        if (item.name.startsWith('booking_')) {
          bookingCount++;
        }
      }
    });
  });
  
  return {
    totalBookings: bookingCount,
    totalFiles: totalFileCount,
    channelDistribution: channelFiles
  };
};
