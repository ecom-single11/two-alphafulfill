const db = require('../config/db');

const Users = {
    create: async (data) => {
        const sql = 'INSERT INTO users (name, password, mobile, email, isActive, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
        try {
            const [results] = await db.execute(sql, [data.name, data.password, data.mobile, data.email, data.isActive]);


            let dataJSON = {
                status: 'success',
                data: results
            }

            return dataJSON;
        } catch (err) {
            throw err; // Propagate the error to be handled later
        }
    },

    getAll: async () => {
        try {
            const [results] = await db.execute(`SELECT * FROM users ORDER BY created_at DESC`);

            const modifiedResults = results.map(user => ({
                ...user,
                roleName: user.roleName
            }));

            let dataJSON = {
                status: 'success',
                data: modifiedResults
            };

            return dataJSON;
        } catch (err) {
            throw err;
        }
    },

    
  getAllByPage: async (limit, pageNo, searchtxt) => {
      try {
        const offset = (pageNo - 1) * limit;
    
        let query = 'SELECT * FROM users';
        let queryParams = [];
    
        if (searchtxt) {
          const columns = ['name'];
          const searchConditions = columns.map(col => `${col} LIKE ?`).join(' OR ');
          query += ` WHERE ${searchConditions}`;
          queryParams = columns.map(() => `%${searchtxt}%`);
        }
    
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(limit, offset);
    
        const [results] = await db.execute(query, queryParams);
    
        const [totalCountResults] = await db.execute('SELECT COUNT(*) AS totalCount FROM users');
        const totalCount = totalCountResults[0].totalCount;
    
        return {
          status: 'success',
          data: results,
          totalCount: totalCount
        };
      } catch (err) {
        throw err;
      }
    },
    


    getUserStatus: async (id) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        try {
            const [results] = await db.execute(sql, [id]);

            let status =  results[0].isActive;

            return status;
        } catch (err) {
            throw err;
        }
    },

    update: async (id, data) => {
        const sqlUpdate = 'UPDATE users SET name = ?, password = ?, isActive = ?, mobile = ?, email = ?,  updated_at = NOW() WHERE id = ?';
        try {
            const [updateResults] = await db.execute(sqlUpdate, [data.name, data.password, data.isActive, data.mobile, data.email,  id]);


            const sqlSelect = 'SELECT * FROM users WHERE id = ?';
            const [updatedUser] = await db.execute(sqlSelect, [id]);

            if (updatedUser.length === 0) {
                throw new Error('User not found');
            }

            let dataJSON = {
                status: 'success',
                data: updatedUser[0]
            }

            return dataJSON;
        } catch (err) {
            throw err;
        }
    },
    updateUserToken: async (id, data) => {
        const sqlUpdate = 'UPDATE users SET token = ?, updated_at = NOW() WHERE id = ?';
        try {
            db.execute(sqlUpdate, [data, id]);
        } catch (err) {
            throw err;
        }
    },

    updateUserStatus: async (id, isActive) => {
        const sql = 'UPDATE users SET isActive = ?, updated_at = NOW() WHERE id = ?';
        try {
            const [results] = await db.execute(sql, [isActive, id]);


            let dataJSON = {
                status: 'success',
                data: results
            };

            return dataJSON;
        } catch (err) {
            throw err;
        }
    },

    delete: async (id) => {
        try {
            const [results] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

            return results;
        } catch (err) {
            throw err;
        }
    },
    findByEmail: async (email) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        try {

            const [results] = await db.execute(sql, [email]);

            return {
                status: 'success',
                data: results[0]
            };
        } catch (err) {
            throw err;
        }
    },
    verifyPassword: async function (inputPassword, storedPassword) {
        try {
            return inputPassword === storedPassword;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = Users;