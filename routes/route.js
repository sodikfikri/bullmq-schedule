const EmployeeController = require("../controllers/EmployeeController");
const PREFIX = process.env.API_URL

exports.routesConfig = function (app) {
    app.get(`/${PREFIX}/employee/list`,  EmployeeController.List)
    app.post(`/${PREFIX}/employee/add`, EmployeeController.InsData)
    
    app.post(`/${PREFIX}/msisdn/post`, EmployeeController.InsMsisdn)

    app.post(`/${PREFIX}/queue/drain`, EmployeeController.Drain)
}