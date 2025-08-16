const express = require('express');
const router = express.Router();
const db = require('../../database/createDataBase'); // Correct path to your database instance
const { generateToken, comparePassword } = require('../../utils/jwtUtils'); // Correct path to your JWT utilities
const { body, validationResult } = require('express-validator'); // For input validation

// POST /api/police/login
router.post(
  '/login',
  [
    // Validate input fields
    body('policeOfficerId', 'Police Officer ID is required').notEmpty().isString(),
    body('password', 'Password is required').notEmpty().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
    }

    const { policeOfficerId, password } = req.body;

    try {
      // 1. Check if the police officer exists
      // Ensure 'passwordText' is the column storing the HASHED password.
      const officer = db.prepare(
        `SELECT po.*, ps.* 
          FROM policeOfficer po
          JOIN policeStation ps ON po.policeStationId = ps.policeStationId
          WHERE po.policeOfficerId = ?;`
      ).get(policeOfficerId);

      if (!officer) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Officer not found.' });
      }
      const status = officer.policeOfficerStatus;
      if(status === 1){
        return res.status(401).json({ success: false, message: 'You Have Been Blocked From This System' });
      }
      // 2. Compare the provided password with the stored hashed password
      // The `comparePassword` function should handle bcrypt or similar comparison.
      const isMatch = await comparePassword(password, officer.passwordText);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      // 3. Generate JWT
      // The payload contains information to be encoded in the token.
      // 'role' is a common claim used for authorization.
      const payload = {
        policeOfficerId: officer.policeOfficerId,
        role: officer.policeOfficerRoleName,
        policeStationId: officer.policeStationId,
        // You can add other non-sensitive data to the payload if needed
      };
      const token = generateToken(payload);

      // 4. Respond with the token and selected officer data
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        officer: {
          policeOfficerId: officer.policeOfficerId,
          firstName: officer.policeOfficerFname,
          middleName:officer.policeOfficerMname,
          lastName: officer.policeOfficerLname,
          roleName: officer.policeOfficerRoleName,
          role: officer.role,
          policeStationId: officer.policeStationId,
          profilePicture: officer.profilepicture,
          nameOfPoliceStation:officer.nameOfPoliceStation,
          policeStationLogo:officer.policeStationLogo,
          townId:officer.townId,
          subCity:officer.subCity
           // Path or URL to the profile picture
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      // Use your existing errorHandler or send a generic server error
      res.status(500).json({ success: false, message: 'Server error during login process.' });
    }
  }
);

module.exports = router;