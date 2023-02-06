import React, { useMemo } from 'react';
import classNames from 'classnames';
import Heading from 'Components/Heading/Heading';
import AdSlot from 'Components/AdSlot/AdSlot';
import useAdConsent from 'Hooks/useAdConsent/useAdConsent';
import styles from './PartnerCenter.module.scss';

function PartnerCenter() {
    const adConsent = useAdConsent();

    const adSize = useMemo(
        () => [
            [230, 230],
            [460, 460],
        ],
        []
    );

    const adTargetsFirst = useMemo(
        () => ({ position: '11', inventory: 'BTF' }),
        []
    );
    const adTargetsSecond = useMemo(
        () => ({ position: '12', inventory: 'BTF' }),
        []
    );
    const adTargetsThird = useMemo(
        () => ({ position: '13', inventory: 'BTF' }),
        []
    );
    const adTargetsFourth = useMemo(
        () => ({ position: '14', inventory: 'BTF' }),
        []
    );
    const adSlotContainerClasses = classNames({
        [styles.container]: true,
        [styles['collapse-slot']]: adConsent === false,
    });

    return (
        <section className={adSlotContainerClasses}>
            <Heading level={2} className={styles['partner-center-title']}>
                Partner Center
            </Heading>
            <div className={styles['ad-container']}>
                {adConsent && (
                    <>
                        <AdSlot
                            className={styles['ad-slot']}
                            path="/34363400/HBR_460x460"
                            size={adSize}
                            targets={adTargetsFirst}
                        />
                        <AdSlot
                            className={styles['ad-slot']}
                            path="/34363400/HBR_460x460"
                            size={adSize}
                            targets={adTargetsSecond}
                        />
                        <AdSlot
                            className={styles['ad-slot']}
                            path="/34363400/HBR_460x460"
                            size={adSize}
                            targets={adTargetsThird}
                        />
                        <AdSlot
                            className={styles['ad-slot']}
                            path="/34363400/HBR_460x460"
                            size={adSize}
                            targets={adTargetsFourth}
                        />
                    </>
                )}
            </div>
        </section>
    );
}

export default PartnerCenter;
