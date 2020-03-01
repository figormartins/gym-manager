const fs = require("fs")
const data = require("../data.json")
const { age, date } = require("../utils")

exports.index = (req, res) => {
  return res.render("instructors/index", { instructors: data.instructors })
}

exports.show = (req, res) => {
  const { id } = req.params

  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id
  })

  if (!foundInstructor)
    res.send("Instructor not found")

  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth),
    birth: "",
    services: foundInstructor.services.split(","),
    created_at: new Intl.DateTimeFormat("en-GB").format(foundInstructor.created_at)
  }

  res.render("instructors/show", { instructor })
}

exports.create = (req, res) => {
  return res.render("instructors/create")
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body)

  for (const key of keys) {
    if (req.body[key].trim() === "")
      return res.send("Please, fill all fields!")
  }

  req.body.birth = Date.parse(req.body.birth)
  req.body.created_at = Date.now()
  req.body.id = Number(data.instructors.length + 1)

  const { id, avatar_url, name, birth, gender, services, created_at } = req.body

  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error.")

    return res.redirect("/instructors")
  })
}

exports.edit = (req, res) => {
  const { id } = req.params

  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id
  })

  if (!foundInstructor)
    res.send("Instructor not found")

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth).iso
  }

  return res.render("instructors/edit", { instructor })
}

exports.put = (req, res) => {
  const { id } = req.body
  let index = 0

  const foundInstructor = data.instructors.find((instructor, foundIndex) => {
    if (instructor.id == id) {
      index = foundIndex
      return true
    }
  })

  if (!foundInstructor)
    res.send("instructor not found!")

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.instructors[index] = instructor

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error.")

    return res.redirect(`/instructors/${id}`)
  })
}

exports.delete = (req, res) => {
  const{ id } = req.body
  const filteredInstructors = data.instructors.filter(instructor => instructor.id != id)

  data.instructors = filteredInstructors

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error.")

    return res.redirect("/instructors")
  })
}