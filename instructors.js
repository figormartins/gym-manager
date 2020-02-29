const fs = require("fs")
const data = require("./data.json")
const { age, date } = require("./utils")

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

exports.post = (req, res) => {
  const keys = Object.keys(req.body)

  for (const key of keys) {
    if (req.body[key].trim() === "")
      return res.send("Please, fill all fields!")
  }

  req.body.birth = Date.parse(req.body.birth)
  req.body.created_at = Date.now()
  req.body.id = Number(data.instructors.length + 1)
  req.body.avatar_url = "https://source.unsplash.com/collection/2315391/500x500"

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
    birth: date(foundInstructor.birth)
  }

  return res.render("instructors/edit", { instructor })
}

exports.put = (req, res) => {
  const { id } = req.body

  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id
  })
  
  if (!foundInstructor)
    res.send("instructor not found!")

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth)
  }
  
  data.instructors[id - 1] = instructor
  
  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error.")

    return res.redirect(`/instructors/${id}`)
  })
}