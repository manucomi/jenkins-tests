import AdSlot from 'mfe-core/ui/AdSlot';
import styles from './PrimaryAd.module.scss';

const TestIds = {
    CONTAINER: 'ad-container',
};

const unitId = 'primary-ad-slot';

function PrimaryAd() {
    return (
        <div className={styles['ad-container']} data-testid={TestIds.CONTAINER}>
            <AdSlot unitId={unitId} />
        </div>
    );
}

export default PrimaryAd;
export { TestIds as PrimaryAdTestIds, unitId as primaryAdUnitId };
