import styles from '@/ui/header/header.module.css';
import Header from "./Header";
import CustomButton from "../button/CustomButton";
import DropdownMenu, { DropdownOption } from "../dropdown/DropdownMenu";
import PersonIcon from '@/public/person_24dp.svg'
import ThemeToggle from "../button/ThemeToggle";
import BrandLogo from '../brand/BrandLogo';

type Props = {
  readonly dropDownOptions: DropdownOption[];
}

export default function HomeHeader({ dropDownOptions }: Props) {
  return (
    <Header>
      <BrandLogo />
      <div className={styles.headerButtons}>
        <ThemeToggle />

        <DropdownMenu
          trigger={
            <CustomButton variant="secondary" style={{ padding: '0.4rem' }}>
              <PersonIcon width={24} height={24} />
            </CustomButton>
          }
          options={dropDownOptions}
        />
      </div>
    </Header>
  );
}