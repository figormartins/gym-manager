const { age, date } = require("../../lib/utils")
const Member = require("../models/Member")


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
      callback(members) {
        const pagination = {
          total: +Math.ceil(members[0].total / limit),
          page
        }

        return res.render("members/index", { members, filter, pagination })
      }
    }

    Member.paginate(params)
  },
  show(req, res) {
    Member.find(req.params.id, (member) => {
      if (!member) return res.send("Member not found!")

      member.birth = date(member.birth).birthdate

      res.render("members/show", { member })
    })
  },
  create(req, res) {
    Member.instructorSelectOptions((options) => {
      return res.render("members/create", { instructorOptions: options })
    })
  },
  post(req, res) {
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if (req.body[key].trim() === "")
        return res.send("Please, fill all fields!")
    }

    Member.create(req.body, (member) => {
      res.redirect(`/members/${member.id}`)
    })
  },
  edit(req, res) {
    Member.find(req.params.id, (member) => {
      if (!member) return res.send("Member not found!")

      member.birth = date(member.birth).iso

      Member.instructorSelectOptions((options) => {
        return res.render("members/edit", { instructorOptions: options, member })
      })
    })
  },
  put(req, res) {
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if (req.body[key].trim() === "")
        return res.send("Please, fill all fields!")
    }

    Member.update(req.body, () => {
      return res.redirect(`members/${req.body.id}`)
    })
  },
  delete(req, res) {
    Member.delete(req.body.id, () => {
      res.redirect("/members")
    })
  },
}