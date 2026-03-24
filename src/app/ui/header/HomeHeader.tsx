import { config } from "@/app/lib/config";
import Header from "./Header";
import CustomButton from "../button/CustomButton";
import DropdownMenu, { DropdownOption } from "../dropdown/DropdownMenu";
import PersonIcon from '@/public/person_24dp.svg'

type Props = {
  readonly dropDownOptions: DropdownOption[];
}

export default function HomeHeader({ dropDownOptions }: Props) {
  const appName = config.appName;

  return (
    <Header>
      <h2>{appName}</h2>
      <div>
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