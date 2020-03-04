const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
  all(callback) {
    const query = `
      SELECT instructors.*, COUNT(members) AS total_students
      FROM instructors
      LEFT JOIN members ON (instructors.id = members.instructor_id)
      GROUP BY instructors.id
      ORDER BY total_students DESC
    `
    db.query(query, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },
  create(data, callback) {
    const query = `
    INSERT INTO instructors (
      name,
      avatar_url,
      gender,
      services,
      birth,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
    `

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.services,
      date(data.birth).iso,
      date(Date.now()).iso
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback) {
    const query = `SELECT * FROM instructors WHERE id = $1`
    db.query(query, [id], (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
  },
  findBy(filter, callback) {
    const query = "SELECT instructors.*, COUNT(members) AS total_students FROM instructors LEFT JOIN members ON (instructors.id = members.instructor_id) WHERE instructors.name ILIKE $1 OR instructors.services ILIKE $1 GROUP BY instructors.id ORDER BY total_students DESC"

    db.query(query, [`%${filter}%`], (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },
  update(data, callback) {
    const query = `
      UPDATE instructors
      SET  avatar_url=$1, name=$2, birth=$3, gender=$4, services=$5
      WHERE id = $6 `

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback()
    })
  },
  delete(id, callback) {
    const query = `DELETE FROM instructors WHERE id = $1`
    db.query(query, [id], (err, results) => {
      if (err) throw `Database error! ${err}`

      callback()
    })
  }
}