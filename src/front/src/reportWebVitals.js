const reportWebVitals = onPerfEntry => {
    onPerfEntry && typeof onPerfEntry && import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
    });
};

export default reportWebVitals;
