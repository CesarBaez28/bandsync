'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './tabs.module.css';
import CustomButton from '../button/CustomButton';

type TabItem = {
  key: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  readonly tabs: TabItem[];
  readonly defaultActiveKey?: string;
  readonly onChange?: (key: string) => void;
};

export default function Tabs({ tabs, defaultActiveKey, onChange }: TabsProps) {
  const [activeKey, setActiveKey] = useState<string>(
    defaultActiveKey ?? tabs[0]?.key
  );

  const handleTabClick = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  return (
    <div className={styles.tabsContainer}>
      <div role="tablist" className={styles.tabList}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <CustomButton
              style={{padding: '0.75rem 1rem'}}
              variant='tertiary'
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabClick(tab.key)}
              className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={styles.activeIndicator}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </CustomButton>
          );
        })}
      </div>

      <div role="tabpanel" className={styles.tabContent}>
        {tabs.find((tab) => tab.key === activeKey)?.content}
      </div>
    </div>
  );
}
