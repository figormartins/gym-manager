const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM members`, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },
  create(data, callback) {
    const query = `
    INSERT INTO members (
      name,
      avatar_url,
      gender,
      email,
      birth,
      blood,
      weight,
      height,
      instructor_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
    `
    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.email,
      date(data.birth).iso,
      data.blood,
      data.weight,
      data.height,
      data.instructor
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback) {
    const query = `
      SELECT members.*, instructors.name AS instructor_name
      FROM members
      LEFT JOIN instructors ON (members.instructor_id = instructors.id)
      WHERE members.id = $1`

    db.query(query, [id], (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
  },
  update(data, callback) {
    const query = `
      UPDATE members
      SET  avatar_url=$1, name=$2, birth=$3, gender=$4, email=$5, blood=$6, weight=$7, height=$8, instructor_id=$9
      WHERE id = $10 `

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.email,
      data.blood,
      data.weight,
      data.height,
      data.instructor,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback()
    })
  },
  delete(id, callback) {
    const query = `DELETE FROM members WHERE id = $1`
    db.query(query, [id], (err, results) => {
      if (err) throw `Database error! ${err}`

      callback()
    })
  },
  instructorSelectOptions(callback) {
    db.query(`SELECT id, name FROM instructors`, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params
    let filterParam = []
    const condition = filter ? " WHERE members.name ILIKE $1 OR members.email ILIKE $1" : ""
    let totalQuery = `(SELECT COUNT(*) FROM members ${condition}) AS total`

    let query = `
      SELECT members.*,
      ${totalQuery}
      FROM members
    `

    if (filter) {
      query += condition
      filterParam.push(`%${filter}%`)
      query += " LIMIT $2 OFFSET $3"
    }
    else {
      query += " LIMIT $1 OFFSET $2"
    }


    db.query(query, [...filterParam, limit, offset], (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  }
}