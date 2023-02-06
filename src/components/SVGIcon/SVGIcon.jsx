import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './SVGIcon.module.scss';

const Variants = {
    HAMBURGER: 'hamburger',
    SEARCH: 'search',
    X: 'x',
    USER_IN_SHIELD: 'user-in-shield',
    CARET: 'caret',
    MANAGEMENT_TIP: 'management tip',
    DAILY_ALERT: 'daily alert',
    LEADERSHIP: 'leadership',
    BEST_OF: 'best of',
    ARROW_RIGHT_NAV: 'arrow right nav',
    CIRCLE_ARROW_RIGHT: 'circle arrow right',
    CIRCLE_CHEVRON_RIGHT: 'circle chevron right',
    FOR_YOU: 'for you',
    MAGAZINE: 'magazine',
};

const getVariantRenderData = (variant) => {
    let variantData;

    switch (variant) {
        case Variants.HAMBURGER:
            variantData = {
                svg: (
                    <>
                        <path d="M24 3.5H0v1.1h3.37V21h17.25V4.6H24zm-4.47 16.4H4.47v-15h15.06z" />
                        <path d="M7.5 8.07h9v1.1h-9zM7.5 15.57h9v1.1h-9zM7.5 11.82h9v1.1h-9z" />
                    </>
                ),
                viewBox: '0 0 24 24',
            };
            break;
        case Variants.SEARCH:
            variantData = {
                svg: (
                    <path d="M24.06 23.22l-6.38-6.38a10.11 10.11 0 10-.85.85l6.37 6.37zM1.2 10.13A8.93 8.93 0 1110.13 19a8.94 8.94 0 01-8.93-8.87z" />
                ),
                viewBox: '0 0 24 24',
            };
            break;
        case Variants.X:
            variantData = {
                classes: styles.x,
                svg: (
                    <>
                        <line x1="5" y1="5" x2="19" y2="19" />
                        <line x1="19" y1="5" x2="5" y2="19" />
                    </>
                ),
                viewBox: '0 0 24 24',
            };
            break;
        case Variants.USER_IN_SHIELD:
            variantData = {
                svg: (
                    <path d="M22.36,0H1.64S.64,11,4,15.92A33.23,33.23,0,0,0,12,24a33.23,33.23,0,0,0,8-8.08C23.36,11,22.36,0,22.36,0ZM12,22.5a32.47,32.47,0,0,1-6.28-6.24,11,11,0,0,1,2.06-.89c.44-.16.91-.33,1.45-.54a2.43,2.43,0,0,0,1.52-2.1,2.1,2.1,0,0,0-.59-1.4,2.84,2.84,0,0,1-1-2.15V6.72a2.84,2.84,0,0,1,5.67,0V9.18a2.83,2.83,0,0,1-1,2.18l-.07.07a2.06,2.06,0,0,0-.49,1.3,2.46,2.46,0,0,0,1.58,2.13c.5.2,1,.37,1.42.53a11.07,11.07,0,0,1,2,.88A32.48,32.48,0,0,1,12,22.5Zm7-7.26-.09.13a11.46,11.46,0,0,0-2.29-1c-.43-.16-.89-.32-1.34-.5s-.94-.71-.94-1.13a.94.94,0,0,1,.22-.57,3.93,3.93,0,0,0,1.37-3V6.72a3.94,3.94,0,1,0-7.87,0V9.18a3.87,3.87,0,0,0,1.31,2.93,1,1,0,0,1,.27.62,1.39,1.39,0,0,1-.87,1.1c-.48.19-.94.36-1.37.51a11.47,11.47,0,0,0-2.33,1L5,15.25C2.5,11.57,2.62,4,2.76,1.2H21.24C21.38,4,21.5,11.57,19,15.25Z" />
                ),
                viewBox: '0 0 24 24',
            };
            break;
        case Variants.CARET:
            variantData = {
                svg: <path d="M 0 16 l 12 -14 l 12 14" />,
                viewBox: '0 0 24 24',
            };
            break;
        case Variants.MANAGEMENT_TIP:
            variantData = {
                classes: styles['management-tip'],
                svg: (
                    <>
                        <path
                            className={styles['icon-mgmt-tip-1']}
                            d="M83.683,50.92a5.06,5.06,0,0,0-7.153,0l3.043-3.043a5.06,5.06,0,1,0-7.156-7.157l-7.4,7.4h0l7.4-7.4a5.061,5.061,0,1,0-7.157-7.157L78.123,20.7a5.061,5.061,0,1,0-7.157-7.157L50.7,33.805,40.062,44.444V34.775a5.061,5.061,0,1,0-10.121,0V61.347a20.233,20.233,0,0,0,34.476,16L79.329,62.432h0l4.354-4.355A5.06,5.06,0,0,0,83.683,50.92Z"
                        />
                        <path
                            className={styles['icon-mgmt-tip-2']}
                            d="M76.527,50.92l-16,16a5.061,5.061,0,1,0,7.157,7.157l13.1-13.1"
                        />
                        <path
                            className={styles['icon-mgmt-tip-2']}
                            d="M72.416,40.717,53.371,59.762a5.061,5.061,0,0,0,7.157,7.157"
                        />
                        <path
                            className={styles['icon-mgmt-tip-2']}
                            d="M65.259,33.56,46.214,52.605a5.061,5.061,0,0,0,7.157,7.157"
                        />
                        <path
                            className={styles['icon-mgmt-tip-3']}
                            d="M49.8,58.572a2.4,2.4,0,0,1-1.694-4.091L50.085,52.5l3.389,3.389L51.5,57.871A2.382,2.382,0,0,1,49.8,58.572Z"
                        />
                        <path
                            className={styles['icon-mgmt-tip-3']}
                            d="M56.958,65.729a2.4,2.4,0,0,1-1.7-4.09l1.979-1.979,3.389,3.388-1.979,1.979A2.379,2.379,0,0,1,56.958,65.729Z"
                        />
                        <path
                            className={styles['icon-mgmt-tip-3']}
                            d="M64.114,72.886A2.4,2.4,0,0,1,62.42,68.8L64.4,66.816l3.388,3.389-1.978,1.979A2.379,2.379,0,0,1,64.114,72.886Z"
                        />
                        <line
                            className={styles['icon-mgmt-tip-2']}
                            x1="35.001"
                            y1="18.13"
                            x2="35.001"
                            y2="6.197"
                        />
                        <line
                            className={styles['icon-mgmt-tip-2']}
                            x1="29.179"
                            y1="20.542"
                            x2="20.741"
                            y2="12.104"
                        />
                        <line
                            className={styles['icon-mgmt-tip-2']}
                            x1="26.768"
                            y1="26.364"
                            x2="14.834"
                            y2="26.364"
                        />
                        <line
                            className={styles['icon-mgmt-tip-2']}
                            x1="40.824"
                            y1="20.542"
                            x2="49.262"
                            y2="12.104"
                        />
                        <path
                            className={styles['icon-mgmt-tip-6']}
                            d="M64.417,77.344a20.224,20.224,0,0,1-34.43-12.2L30,69.109a19.666,19.666,0,0,0,38.989,3.664Z"
                        />
                        <path
                            className={styles['icon-mgmt-tip-4']}
                            d="M67.625,77.088a19.644,19.644,0,0,1-35.925,0,8.37,8.37,0,0,0-7.7,8.34h0A8.375,8.375,0,0,0,32.376,93.8H66.965a8.374,8.374,0,0,0,8.374-8.374h0A8.37,8.37,0,0,0,67.625,77.088Z"
                        />
                        <path
                            className={styles['icon-mgmt-tip-3']}
                            d="M29.941,35.505v8.622a4.03,4.03,0,0,0,4.03-4.031V35.505Z"
                        />
                    </>
                ),
                viewBox: '0 0 100 97',
            };
            break;
        case Variants.DAILY_ALERT:
            variantData = {
                classes: styles['daily-alert'],
                svg: (
                    <>
                        <rect
                            className={styles['icon-daily-alert-1']}
                            x="17.113"
                            y="35.309"
                            width="65.774"
                            height="45.22"
                        />
                        <rect
                            className={styles['icon-daily-alert-5']}
                            x="17.113"
                            y="18.866"
                            width="65.774"
                            height="16.444"
                        />
                        <circle
                            className={styles['icon-daily-alert-2']}
                            cx="71.837"
                            cy="27.088"
                            r="4.339"
                        />
                        <circle
                            className={styles['icon-daily-alert-2']}
                            cx="28.163"
                            cy="27.088"
                            r="4.339"
                        />
                        <circle
                            className={styles['icon-daily-alert-2']}
                            cx="42.721"
                            cy="27.088"
                            r="4.339"
                        />
                        <circle
                            className={styles['icon-daily-alert-2']}
                            cx="57.279"
                            cy="27.088"
                            r="4.339"
                        />
                        <line
                            className={styles['icon-daily-alert-3']}
                            x1="28.163"
                            y1="15.144"
                            x2="28.163"
                            y2="26.381"
                        />
                        <line
                            className={styles['icon-daily-alert-1']}
                            y1="15.144"
                            x2="42.721"
                            y2="26.381"
                        />
                        <line
                            className={styles['icon-daily-alert-3']}
                            x1="57.279"
                            y1="15.144"
                            x2="57.279"
                            y2="26.381"
                        />
                        <line
                            className={styles['icon-daily-alert-3']}
                            x1="71.837"
                            y1="15.144"
                            x2="71.837"
                            y2="26.381"
                        />
                        <path
                            className={styles['icon-daily-alert-2']}
                            d="M55.5,43.818a1.972,1.972,0,0,0-1.567-.765H46.063a1.986,1.986,0,0,0-1.928,2.468l3.938,15.8a1.986,1.986,0,0,0,3.855,0l3.936-15.8A1.981,1.981,0,0,0,55.5,43.818Z"
                        />
                        <circle
                            className={styles['icon-daily-alert-2']}
                            cx="50"
                            cy="69.507"
                            r="3.278"
                        />
                    </>
                ),
                viewBox: '0 0 100 85',
            };
            break;
        case Variants.LEADERSHIP:
            variantData = {
                classes: styles.leadership,
                svg: (
                    <>
                        <polygon
                            className={styles['icon-leadership-6']}
                            points="29.665 60.096 33.224 63.655 36.745 60.133 29.665 47.87 22.585 60.133 26.107 63.655 29.665 60.096"
                        />
                        <rect
                            className={styles['icon-leadership-1']}
                            x="34.347"
                            y="9.246"
                            width="22.978"
                            height="16.662"
                        />
                        <polygon
                            className={styles['icon-leadership-2']}
                            points="34.347 25.908 34.347 16.344 18.467 16.344 18.467 33.006 41.445 33.006 41.445 25.908 34.347 25.908"
                        />
                        <polygon
                            className={styles['icon-leadership-6']}
                            points="41.445 33.006 34.347 25.908 41.445 25.908 41.445 33.006"
                        />
                        <line
                            className={styles['icon-leadership-3']}
                            x1="57.326"
                            y1="53.181"
                            x2="57.326"
                            y2="9.246"
                        />
                        <polygon
                            className={styles['icon-leadership-6']}
                            points="57.326 53.181 61.687 57.542 66.002 53.227 57.326 38.198 48.649 53.227 52.965 57.542 57.326 53.181"
                        />
                        <polygon
                            className={styles['icon-leadership-1']}
                            points="66.002 53.227 61.687 57.542 57.326 53.181 52.965 57.542 48.649 53.227 26.982 90.754 87.669 90.754 66.002 53.227"
                        />
                        <polygon
                            className={styles['icon-leadership-2']}
                            points="40.703 66.989 36.745 60.133 33.224 63.655 29.665 60.096 26.107 63.655 22.585 60.133 4.906 90.754 26.982 90.754 40.703 66.989"
                        />
                        <path
                            className={styles['icon-leadership-1']}
                            d="M88.277,23.471a6.793,6.793,0,0,0-4.885,2.068,9.06,9.06,0,0,0-16.781,4.749H95.094A6.817,6.817,0,0,0,88.277,23.471Z"
                        />
                    </>
                ),
                viewBox: '0 0 100 96',
            };
            break;
        case Variants.BEST_OF:
            variantData = {
                classes: styles['best-of'],
                svg: (
                    <>
                        <path
                            className={styles['icon-best-of-1']}
                            d="M79.216,18.706V35.229a.309.309,0,0,1-.484.254l-4.144-2.864a.309.309,0,0,0-.351,0l-4.143,2.864a.309.309,0,0,1-.485-.254V18.706H55.662A5.662,5.662,0,0,0,50,24.368h0V81.294a5.662,5.662,0,0,1,5.662-5.662H89.218V18.706Z"
                        />
                        <path
                            className={styles['icon-best-of-5']}
                            d="M44.338,18.706H10.782V75.632H44.338A5.662,5.662,0,0,1,50,81.294V24.367A5.662,5.662,0,0,0,44.338,18.706Z"
                        />
                        <path
                            className={styles['icon-best-of-2']}
                            d="M70.129,45.9l1.629,5.016a.547.547,0,0,0,.52.377h5.274a.546.546,0,0,1,.321.988l-4.267,3.1a.548.548,0,0,0-.2.611l1.63,5.016a.547.547,0,0,1-.841.611l-4.267-3.1a.546.546,0,0,0-.642,0l-4.267,3.1a.546.546,0,0,1-.84-.611l1.629-5.016a.546.546,0,0,0-.2-.611l-4.267-3.1a.546.546,0,0,1,.321-.988H66.94a.546.546,0,0,0,.52-.377L69.09,45.9A.546.546,0,0,1,70.129,45.9Z"
                        />
                        <line
                            className={styles['icon-best-of-3']}
                            x1="19.633"
                            y1="49.241"
                            x2="41.148"
                            y2="49.241"
                        />
                        <line
                            className={styles['icon-best-of-3']}
                            x1="19.633"
                            y1="57.112"
                            x2="41.148"
                            y2="57.112"
                        />
                        <line
                            className={styles['icon-best-of-3']}
                            x1="19.633"
                            y1="64.982"
                            x2="41.148"
                            y2="64.982"
                        />
                        <rect
                            className={styles['icon-best-of-2']}
                            x="19.633"
                            y="29.356"
                            width="10.758"
                            height="10.758"
                        />
                        <path
                            className={styles['icon-best-of-2']}
                            d="M78.732,35.483l-4.144-2.864a.309.309,0,0,0-.351,0l-4.143,2.864a.309.309,0,0,1-.485-.254V18.706h9.607V35.229A.309.309,0,0,1,78.732,35.483Z"
                        />
                        <path
                            className={styles['icon-best-of-4']}
                            d="M44.338,75.632H10.782V24.368H5.12V81.294H50A5.662,5.662,0,0,0,44.338,75.632Z"
                        />
                        <path
                            className={styles['icon-best-of-4']}
                            d="M89.218,24.368V75.632H55.662A5.662,5.662,0,0,0,50,81.294H94.88V24.368Z"
                        />
                    </>
                ),
                viewBox: '0 0 100 96',
            };
            break;
        case Variants.CIRCLE_ARROW_RIGHT:
            variantData = {
                classes: styles['circle-arrow-right'],
                svg: (
                    <path d="M280.3 134.4c-9.719-9-24.91-8.438-33.94 1.25-9 9.719-8.469 24.88 1.25 33.94L314.9 232H144c-13.2 0-24 10.8-24 24s10.8 24 24 24h170.9l-67.21 62.41c-9.719 9.062-10.25 24.22-1.25 33.94 9.031 9.688 24.22 10.25 33.94 1.25l112-104C397.2 269 400 262.7 400 256s-2.781-13.03-7.656-17.59L280.3 134.4zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208-93.3 208-208 208z" />
                ),
                viewBox: '0 0 512 512',
            };
            break;
        case Variants.CIRCLE_CHEVRON_RIGHT:
            variantData = {
                classes: styles['circle-chevron-right'],
                svg: (
                    <path d="M7.50313 3.96875C7.21016 3.67578 6.73563 3.67578 6.4425 3.96875C6.14937 4.26172 6.14953 4.73625 6.4425 5.02938L9.44063 8L6.47094 10.9697C6.17797 11.2627 6.17797 11.7372 6.47094 12.0303C6.76391 12.3234 7.23844 12.3233 7.53156 12.0303L11.0316 8.53031C11.1781 8.38437 11.25 8.19375 11.25 8C11.25 7.80625 11.1768 7.61625 11.0303 7.46969L7.50313 3.96875ZM8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 14.5C4.41563 14.5 1.5 11.5841 1.5 8C1.5 4.41594 4.41563 1.5 8 1.5C11.5844 1.5 14.5 4.41594 14.5 8C14.5 11.5841 11.5844 14.5 8 14.5Z" />
                ),
                viewBox: '0 0 16 16',
            };
            break;
        case Variants.ARROW_RIGHT_NAV:
            variantData = {
                classes: styles['arrow-right-nav'],
                svg: (
                    <path d="M9.35355 4.35355C9.54882 4.15829 9.54882 3.84171 9.35355 3.64645L6.17157 0.464466C5.97631 0.269204 5.65973 0.269204 5.46447 0.464466C5.2692 0.659728 5.2692 0.976311 5.46447 1.17157L8.29289 4L5.46447 6.82843C5.2692 7.02369 5.2692 7.34027 5.46447 7.53553C5.65973 7.7308 5.97631 7.7308 6.17157 7.53553L9.35355 4.35355ZM0 4.5H9V3.5H0V4.5Z" />
                ),
                viewBox: '0 0 10 8',
            };
            break;
        case Variants.FOR_YOU:
            variantData = {
                classes: styles['for-you'],
                svg: (
                    <>
                        <g clipPath="url(#clip0_118_855)">
                            <rect className={styles['for-you-1']} />
                            <circle
                                cx="8"
                                cy="8"
                                r="3.5"
                                className={styles['for-you-2']}
                            />
                            <path
                                d="M1 5V1H5"
                                className={styles['for-you-3']}
                            />
                            <path
                                d="M15 11L15 15L11 15"
                                className={styles['for-you-4']}
                            />
                            <path
                                d="M15 5V1H11"
                                className={styles['for-you-5']}
                            />
                            <path
                                d="M1 11L1 15L5 15"
                                className={styles['for-you-6']}
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_118_855">
                                <rect className={styles['for-you-7']} />
                            </clipPath>
                        </defs>
                    </>
                ),
                viewBox: '0 0 18 13',
            };
            break;
        case Variants.MAGAZINE:
            variantData = {
                classes: styles.magazine,
                svg: (
                    <>
                        <g clipPath="url(#a)">
                            <path
                                className={styles['magazine-1']}
                                d="M0 0h21.31v16H0z"
                            />
                            <path
                                d="M15.868 6.244V1.256l4.987-.453v4.534l-4.987.907z"
                                className={styles['magazine-2']}
                            />
                            <path
                                d="M10.881 7.15V1.71l4.987-.454v4.988l-4.987.906z"
                                className={styles['magazine-3']}
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="m10.579 2.262 9.823-1.232v12.694l-9.823 1.36-9.672-1.36V1.03l9.672 1.232zm0-.914L21.31.002v14.512L10.578 16 0 14.512V0l10.58 1.348z"
                                className={styles['magazine-4']}
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.11 15.311V1.71h.907V15.31h-.907zM15.351 6.244V.803h.907v5.44h-.906z"
                                className={styles['magazine-4']}
                            />
                            <path
                                d="M1.814 3.625v-.916l7.254.924v.916l-7.254-.924zM1.814 6.509v-.916l7.254.924v.917l-7.254-.925zM1.814 9.393v-.916l7.254.925v.916l-7.254-.925zM1.814 12.277v-.916l7.254.925v.916l-7.254-.925zM20.855 6.162v-.916l-9.974 1.271v.916l9.974-1.271z"
                                className={styles['magazine-4']}
                            />
                        </g>
                        <defs>
                            <clipPath id="a">
                                <path
                                    className={styles['magazine-1']}
                                    d="M0 0h21.31v16H0z"
                                />
                            </clipPath>
                        </defs>
                    </>
                ),
            };
            break;
        default:
            variantData = { svg: null };
    }

    return { classes: '', ...variantData };
};

function SVGIcon({ className, variant }) {
    const {
        classes: variantClasses,
        svg: variantSVG,
        viewBox: variantViewBox,
    } = getVariantRenderData(variant);
    const withClasses = classNames({
        [styles.icon]: true,
        [variantClasses]: true,
        [className]: className,
    });

    if (variantSVG) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={variantViewBox}
                role="img"
                className={withClasses}
                aria-hidden
            >
                {variantSVG}
            </svg>
        );
    }

    return null;
}

SVGIcon.variants = Variants;

SVGIcon.defaultProps = {
    className: '',
};

SVGIcon.propTypes = {
    variant: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default SVGIcon;
