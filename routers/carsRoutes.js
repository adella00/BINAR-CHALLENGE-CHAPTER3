const express = require("express")
const carsController = require("../controllers/carsController")
const router = express.Router()

router.param("id", carsController.checkId)

router
  .route("/")
  .get(carsController.ping)
  .post(
    carsController.checkBody,
    carsController.addCar
  )
router
  .route("/cars")
  .get(carsController.getListCars)
router
  .route("/:id")
  .get(carsController.getCarById)
  .put(carsController.editCar)
  .delete(carsController.removeCar)

module.exports = router
