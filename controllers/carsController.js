const fs = require("fs")

// baca data dari file json Cars
const cars = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../data/cars.json`
  )
)

// middleware function
const checkId = (req, res, next, val) => {
  console.log(val)
  const car = cars.find((el) => el.id === val)

  if (!car) {
    return res.status(404).json({
      status: "failed",
      message: `data with id: ${val} not found`,
    })
  }
  next()
}

const checkBody = (req, res, next) => {
  const newData = req.body
  const car = cars.find(
    (el) => el.id === newData.id
  )
  if (car) {
    return res.status(400).json({
      status: "failed",
      message: "data with this id already exist ",
    })
  }
  if (!req.body.model || !req.body.type) {
    return res.status(400).json({
      status: "failed",
      message: "model or type are required",
    })
  }

  next()
}

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
    `${__dirname}/../data/cars.json`,
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

  cars[carIndex] = {
    ...cars[carIndex],
    ...req.body,
  }
  fs.writeFile(
    `${__dirname}/../data/cars.json`,
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

  // proses menghapus data sesuai index array nya => req.params.id
  cars.splice(carIndex, 1)
  // proses update di file json nya
  fs.writeFile(
    `${__dirname}/../data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `berhasil delete data car with id: ${id}`,
        data: null,
      })
    }
  )
}

module.exports = {
  ping,
  getListCars,
  getCarById,
  addCar,
  editCar,
  removeCar,
  checkId,
  checkBody,
}
