import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';

type Locale = 'en' | 'th' | 'jp';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale | string) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      products: 'Products',
      movements: 'Movements',
    },
    header: {
      receive: 'Receive',
      transfer: 'Transfer',
      ship: 'Ship',
      logout: 'Logout',
    },
    dashboard: {
      title: 'Dashboard',
      loading: 'Loading dashboard...',
      totalUnits: 'Total Units',
      totalUnitsDesc: 'Across {count} products',
      productSKUs: 'Product SKUs',
      productSKUsDesc: 'Distinct product types',
      locations: 'Locations',
      locationsDesc: 'Warehouses and docks',
      totalMovements: 'Total Movements',
      totalMovementsDesc: 'In system history',
      chartTitle: 'Top 10 Products by Quantity',
      chartDesc: 'A look at the most stocked items.',
      chartLegend: 'Quantity',
    },
    products: {
      title: 'Products',
      description: 'Manage your products and view their stock levels.',
      loading: 'Loading products...',
      unknownLocation: 'Unknown',
      columns: {
        name: 'Name',
        sku: 'SKU',
        quantity: 'Quantity',
        location: 'Location',
      },
    },
    movements: {
      title: 'Inventory Movements',
      description: 'A complete log of all stock movements.',
      loading: 'Loading movements...',
      unknownProduct: 'Unknown Product',
      na: 'N/A',
      columns: {
        date: 'Date',
        product: 'Product',
        type: 'Type',
        quantity: 'Quantity',
        from: 'From',
        to: 'To',
      },
      types: {
        RECEIVE: 'RECEIVE',
        TRANSFER: 'TRANSFER',
        SHIP: 'SHIP',
      }
    },
    dataTable: {
      filterPlaceholder: 'Filter...',
      noResults: 'No results.',
      previous: 'Previous',
      next: 'Next',
    },
    movementForm: {
      titleReceive: 'Receive Stock',
      titleTransfer: 'Transfer Stock',
      titleShip: 'Ship Stock',
      description: 'Update inventory by recording a new stock movement.',
      validationError: 'Please select a product and enter a valid quantity.',
      productLabel: 'Product',
      productPlaceholder: 'Select a product...',
      quantityLabel: 'Quantity',
      fromLocationLabel: 'From Location',
      toLocationLabel: 'To Location',
      locationPlaceholder: 'Select a location...',
      cancelButton: 'Cancel',
      submitButton: 'Submit Movement',
      submittingButton: 'Submitting...',
    },
    login: {
        welcome: 'Welcome to InvSys',
        signInPrompt: 'Sign in to manage your inventory.',
        emailLabel: 'Email address',
        passwordLabel: 'Password',
        rememberMe: 'Remember me',
        signInButton: 'Sign in',
        signingIn: 'Signing in...',
        tryWith: 'Try with:',
        tryWithIncorrectPassword: 'Or use an incorrect password for',
        errorInvalidCredentials: 'Invalid credentials. Please try again.',
        errorAccountLocked: 'Account locked. Please contact support.',
        errorUnexpected: 'An unexpected error occurred.',
    },
    protectedRoute: {
        loading: 'Loading...',
    }
  },
  th: {
    sidebar: {
      dashboard: 'แดชบอร์ด',
      products: 'สินค้า',
      movements: 'การเคลื่อนไหว',
    },
    header: {
      receive: 'รับสินค้า',
      transfer: 'โอนย้าย',
      ship: 'จัดส่ง',
      logout: 'ออกจากระบบ',
    },
    dashboard: {
      title: 'แดชบอร์ด',
      loading: 'กำลังโหลดแดชบอร์ด...',
      totalUnits: 'จำนวนยูนิตทั้งหมด',
      totalUnitsDesc: 'จากสินค้า {count} รายการ',
      productSKUs: 'SKU สินค้า',
      productSKUsDesc: 'ประเภทสินค้าที่แตกต่างกัน',
      locations: 'สถานที่จัดเก็บ',
      locationsDesc: 'คลังสินค้าและท่าเรือ',
      totalMovements: 'การเคลื่อนไหวทั้งหมด',
      totalMovementsDesc: 'ในประวัติระบบ',
      chartTitle: '10 อันดับสินค้าตามจำนวน',
      chartDesc: 'ภาพรวมสินค้าคงคลังที่มีมากที่สุด',
      chartLegend: 'จำนวน',
    },
    products: {
      title: 'สินค้า',
      description: 'จัดการสินค้าและดูระดับสต็อกของคุณ',
      loading: 'กำลังโหลดสินค้า...',
      unknownLocation: 'ไม่ทราบ',
      columns: {
        name: 'ชื่อ',
        sku: 'SKU',
        quantity: 'จำนวน',
        location: 'สถานที่',
      },
    },
    movements: {
      title: 'การเคลื่อนไหวสินค้าคงคลัง',
      description: 'บันทึกการเคลื่อนไหวสต็อกทั้งหมด',
      loading: 'กำลังโหลดการเคลื่อนไหว...',
      unknownProduct: 'ไม่พบสินค้า',
      na: 'ไม่มี',
      columns: {
        date: 'วันที่',
        product: 'สินค้า',
        type: 'ประเภท',
        quantity: 'จำนวน',
        from: 'จาก',
        to: 'ไปที่',
      },
       types: {
        RECEIVE: 'รับเข้า',
        TRANSFER: 'โอนย้าย',
        SHIP: 'จัดส่ง',
      }
    },
    dataTable: {
      filterPlaceholder: 'ค้นหา...',
      noResults: 'ไม่พบผลลัพธ์',
      previous: 'ก่อนหน้า',
      next: 'ถัดไป',
    },
    movementForm: {
      titleReceive: 'รับสต็อกสินค้า',
      titleTransfer: 'โอนย้ายสต็อก',
      titleShip: 'จัดส่งสต็อก',
      description: 'อัปเดตสินค้าคงคลังโดยบันทึกการเคลื่อนไหวสต็อกใหม่',
      validationError: 'กรุณาเลือกสินค้าและใส่จำนวนที่ถูกต้อง',
      productLabel: 'สินค้า',
      productPlaceholder: 'เลือกสินค้า...',
      quantityLabel: 'จำนวน',
      fromLocationLabel: 'จากสถานที่',
      toLocationLabel: 'ไปยังสถานที่',
      locationPlaceholder: 'เลือกสถานที่...',
      cancelButton: 'ยกเลิก',
      submitButton: 'ยืนยันการเคลื่อนไหว',
      submittingButton: 'กำลังส่ง...',
    },
    login: {
        welcome: 'ยินดีต้อนรับสู่ InvSys',
        signInPrompt: 'เข้าสู่ระบบเพื่อจัดการสินค้าคงคลังของคุณ',
        emailLabel: 'ที่อยู่อีเมล',
        passwordLabel: 'รหัสผ่าน',
        rememberMe: 'จดจำฉันไว้',
        signInButton: 'เข้าสู่ระบบ',
        signingIn: 'กำลังเข้าสู่ระบบ...',
        tryWith: 'ลองใช้:',
        tryWithIncorrectPassword: 'หรือใช้รหัสผ่านที่ไม่ถูกต้องสำหรับ',
        errorInvalidCredentials: 'ข้อมูลประจำตัวไม่ถูกต้อง กรุณาลองอีกครั้ง',
        errorAccountLocked: 'บัญชีถูกล็อค กรุณาติดต่อฝ่ายสนับสนุน',
        errorUnexpected: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
    },
    protectedRoute: {
        loading: 'กำลังโหลด...',
    }
  },
  jp: {
    sidebar: {
      dashboard: 'ダッシュボード',
      products: '製品',
      movements: '移動履歴',
    },
    header: {
      receive: '受領',
      transfer: '転送',
      ship: '出荷',
      logout: 'ログアウト',
    },
    dashboard: {
      title: 'ダッシュボード',
      loading: 'ダッシュボードを読み込み中...',
      totalUnits: '総ユニット数',
      totalUnitsDesc: '{count}個の製品にわたって',
      productSKUs: '製品SKU',
      productSKUsDesc: '個別製品タイプ',
      locations: '場所',
      locationsDesc: '倉庫とドック',
      totalMovements: '総移動数',
      totalMovementsDesc: 'システム履歴内',
      chartTitle: '数量別製品トップ10',
      chartDesc: '最も在庫の多いアイテムの一覧',
      chartLegend: '数量',
    },
    products: {
      title: '製品',
      description: '製品を管理し、在庫レベルを表示します',
      loading: '製品を読み込み中...',
      unknownLocation: '不明',
      columns: {
        name: '名前',
        sku: 'SKU',
        quantity: '数量',
        location: '場所',
      },
    },
    movements: {
      title: '在庫移動',
      description: 'すべての在庫移動の完全なログ',
      loading: '移動履歴を読み込み中...',
      unknownProduct: '不明な製品',
      na: 'N/A',
      columns: {
        date: '日付',
        product: '製品',
        type: 'タイプ',
        quantity: '数量',
        from: 'から',
        to: 'へ',
      },
      types: {
        RECEIVE: '受領',
        TRANSFER: '転送',
        SHIP: '出荷',
      }
    },
    dataTable: {
      filterPlaceholder: 'フィルター...',
      noResults: '結果がありません',
      previous: '前へ',
      next: '次へ',
    },
    movementForm: {
      titleReceive: '在庫受領',
      titleTransfer: '在庫転送',
      titleShip: '在庫出荷',
      description: '新しい在庫移動を記録して在庫を更新します',
      validationError: '製品を選択し、有効な数量を入力してください',
      productLabel: '製品',
      productPlaceholder: '製品を選択...',
      quantityLabel: '数量',
      fromLocationLabel: '元の場所',
      toLocationLabel: '先の場所',
      locationPlaceholder: '場所を選択...',
      cancelButton: 'キャンセル',
      submitButton: '移動を送信',
      submittingButton: '送信中...',
    },
    login: {
        welcome: 'InvSysへようこそ',
        signInPrompt: 'サインインして在庫を管理します',
        emailLabel: 'メールアドレス',
        passwordLabel: 'パスワード',
        rememberMe: 'ログイン状態を維持',
        signInButton: 'サインイン',
        signingIn: 'サインイン中...',
        tryWith: 'でお試しください:',
        tryWithIncorrectPassword: 'または、間違ったパスワードを使用してください',
        errorInvalidCredentials: '認証情報が無効です。もう一度お試しください。',
        errorAccountLocked: 'アカウントはロックされています。サポートにお問い合わせください。',
        errorUnexpected: '予期しないエラーが発生しました。',
    },
     protectedRoute: {
        loading: '読み込み中...',
    }
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    return (savedLocale && ['en', 'th', 'jp'].includes(savedLocale)) ? savedLocale as Locale : 'en';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);
  
  const setLocale = (newLocale: Locale | string) => {
    if (['en', 'th', 'jp'].includes(newLocale)) {
        setLocaleState(newLocale as Locale);
    }
  }

  const t = (key: string, params?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result = translations[locale] as any;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key;
      }
    }

    if (typeof result === 'string' && params) {
        Object.keys(params).forEach(paramKey => {
            result = result.replace(`{${paramKey}}`, String(params[paramKey]));
        });
    }

    return result || key;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
