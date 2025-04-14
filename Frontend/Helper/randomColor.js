const randomColor = () => {
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const rgb1 = randomIntFromInterval(190, 255);
    const rgb2 = randomIntFromInterval(190, 255);
    const rgb3 = randomIntFromInterval(190, 255);

    const bgColor = "rgb(" + rgb1 + "," + rgb2 + "," + rgb3 + ")";

    return bgColor;
};

export default randomColor;
