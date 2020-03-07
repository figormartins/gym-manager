const { age, date } = require("../../lib/utils")
const Instructor = require("../models/Instructor")

module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 2
    let offset = (page - 1) * limit

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(instructors) {
        return res.render("instructors/index", { instructors, filter })
      }
    }

    Instructor.paginate(params)
  },
  show(req, res) {
    Instructor.find(req.params.id, (instructor) => {
      if (!instructor) return res.send("Instructor not found!")

      instructor.age = age(instructor.birth)
      instructor.services = instructor.services.split(",")
      instructor.created_at = date(instructor.created_at).format

      res.render("instructors/show", { instructor })
    })
  },
  create(req, res) {
    return res.render("instructors/create")
  },
  post(req, res) {
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if (req.body[key].trim() === "")
        return res.send("Please, fill all fields!")
    }

    Instructor.create(req.body, (instructor) => {
      res.redirect(`/instructors/${instructor.id}`)
    })
  },
  edit(req, res) {
    Instructor.find(req.params.id, (instructor) => {
      if (!instructor) return res.send("Instructor not found!")

      instructor.birth = date(instructor.birth).iso

      res.render("instructors/edit", { instructor })
    })
  },
  put(req, res) {
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if (req.body[key].trim() === "")
        return res.send("Please, fill all fields!")
    }

    Instructor.update(req.body, () => {
      return res.redirect(`instructors/${req.body.id}`)
    })
  },
  delete(req, res) {
    Instructor.delete(req.body.id, () => {
      res.redirect("/instructors")
    })
  },
}