import Loader from "@/app/ui/loaders/Loader";
import style from '@/app/ui/loaders/loader.module.css';

export default function loadingExportRepertoires() {
  return (
    <div className={style.loaderContainer}>
      <Loader size="lg" />
    </div>
  );
}