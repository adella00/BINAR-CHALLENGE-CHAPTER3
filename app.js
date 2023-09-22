// package
const fs = require("fs")
const express = require("express")
const app = express()

// middleware
app.use(express.json())

const port = process.env.port || 3000

// baca data dari file json TOURS
const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/data/cars.json`)
)

const ping = (req, res) => {
  res.status(200).json({
    message: "ping successfully",
  })
}

const getListCars = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      cars,
    },
  })
}

const getCarById = (req, res) => {
  const id = req.params.id
  const car = cars.find((el) => el.id === id)
  // console.log(user)
  if (!car) {
    return res.status(404).json({
      status: "failed",
      message: `data with id ${id} this not found`,
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      car,
    },
  })
}

const addCar = (req, res) => {
  // generate id untuk data baru dari request api kita
  const newId = cars[cars.length - 1].id + 1
  const newData = Object.assign(
    { id: newId },
    req.body
  )

  cars.push(newData)
  fs.writeFile(
    `${__dirname}/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      // 201 = CREATED
      res.status(201).json({
        status: "success",
        data: {
          user: newData,
        },
      })
    }
  )
}

const editCar = (req, res) => {
  const id = req.params.id
  // findindex=-1 (kalau datanya gk ada)
  const carIndex = cars.findIndex(
    (el) => el.id === id
  )

  if (carIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} this not found`,
    })
  }

  cars[carIndex] = {
    ...cars[carIndex],
    ...req.body,
  }
  fs.writeFile(
    `${__dirname}/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `car with this id ${id} edited`,
        data: {
          user: cars[carIndex],
        },
      })
    }
  )
}

const removeCar = (req, res) => {
  // konversi string jadi number
  const id = req.params.id
  // cari index dari data yang sesuai id di req.param
  const carIndex = cars.findIndex(
    (el) => el.id === id
  )

  // validasi kalau data yang sesuai req.params.id gak ada
  if (carIndex === -1) {
    return res.status(400).json({
      status: "failed",
      message: "data not found",
    })
  }
  // proses menghapus data sesuai index array nya => req.params.id
  cars.splice(carIndex, 1)
  // proses update di file json nya
  fs.writeFile(
    `${__dirname}/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `berhasil delete data with id: ${id}`,
        data: null,
      })
    }
  )
}

// routing
const carRouter = express.Router()

carRouter.route("/").get(ping).post(addCar)
carRouter.route("/cars").get(getListCars)
carRouter
  .route("/:id")
  .get(getCarById)
  .put(editCar)
  .delete(removeCar)

app.use("/", carRouter)
app.use("/cars", carRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
