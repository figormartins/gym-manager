const fs = require("fs")
const data = require("../data.json")
const { date } = require("../utils")

exports.index = (req, res) => {
  return res.render("members/index", { members: data.members })
}

exports.show = (req, res) => {
  const { id } = req.params

  const foundMember = data.members.find((member) => {
    return member.id == id
  })

  if (!foundMember)
    res.send("Member not found")

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).birthdate
  }

  res.render("members/show", { member })
}

exports.create = (req, res) => {
  return res.render("members/create")
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body)

  for (const key of keys) {
    if (req.body[key].trim() === "")
      return res.send("Please, fill all fields!")
  }

  req.body.birth = Date.parse(req.body.birth)
  req.body.id = Number(data.members.length + 1)

  const { avatar_url, name, birth, gender, email, blood, weight, height } = req.body
  let id = 1
  const lastMember = data.members[data.members.length - 1]

  if (lastMember)
    id = lastMember.id + 1

  data.members.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    email,
    blood,
    weight,
    height
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error.")

    return res.redirect("/members")
  })
}

exports.edit = (req, res) => {
  const { id } = req.params

  const foundMember = data.members.find((member) => {
    return member.id == id
  })

  if (!foundMember)
    res.send("Member not found")

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).iso
  }

  return res.render("members/edit", { member })
}

exports.put = (req, res) => {
  const { id } = req.body
  let index = 0

  const foundMember = data.members.find((member, foundIndex) => {
    if (member.id == id) {
      index = foundIndex
      return true
    }
  })

  if (!foundMember)
    res.send("member not found!")

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.members[index] = member

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error.")

    return res.redirect(`/members/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body
  const filteredMembers = data.members.filter(member => member.id != id)

  data.members = filteredMembers

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error.")

    return res.redirect("/members")
  })
}