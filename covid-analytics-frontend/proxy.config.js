
const proxy = [
	{
		context: "/covidWeb",
		target: "http://localhost:8088/covid-web-api/covid",
		pathRewrite: { "^/covidWeb": "" },
	}
];
module.exports = proxy;
