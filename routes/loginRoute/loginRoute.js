const express = require('express');
const router = express.Router();
const db = require('../../database/createDataBase'); // Correct path to your database instance
const { generateToken, comparePassword } = require('../../utils/jwtUtils'); // Correct path to your JWT utilities
const { body, validationResult } = require('express-validator'); // For input validation

// POST /api/police/login
router.post(
  '/login',
  [
    body('policeOfficerId', 'Police Officer ID is required').notEmpty().isString(),
    body('password', 'Password is required').notEmpty().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            message: "Validation errors", 
            errors: errors.array() 
        });
    }

    const { policeOfficerId, password } = req.body;
    console.log("request body",policeOfficerId, password);
    try {
        const result = await db.sql(
            `SELECT po.*, ps.* 
             FROM policeOfficer po
             JOIN policeStation ps ON po.policeStationId = ps.policeStationId
             WHERE po.policeOfficerId = '${policeOfficerId}'`,
            
        );
        console.log("result",result);

        const officer = result[0]; // Get first matching officer
        console.log(officer);
        const status1 = officer.policeOfficerStatus;
        

        if (status1 === 1) {
            return res.status(401).json({ 
                success: false, 
                message: 'You Have Been Blocked From This System' 
            });
        }

        const isMatch = await comparePassword(password, officer.passwordText);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials. Password incorrect.' 
            });
        }

        const payload = {
            policeOfficerId: officer.policeOfficerId,
            role: officer.role,
            policeStationId: officer.policeStationId,
        };
        const token = generateToken(payload);
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            officer: {
                policeOfficerId: officer.policeOfficerId,
                firstName: officer.policeOfficerFname,
                middleName: officer.policeOfficerMname,
                lastName: officer.policeOfficerLname,
                roleName: officer.policeOfficerRoleName,
                role: officer.role,
                policeStationId: officer.policeStationId,
                profilePicture: officer.profilepicture,
                nameOfPoliceStation: officer.nameOfPoliceStation,
                policeStationLogo: officer.policeStationLogo,
                townId: officer.townId,
                subCity: officer.subCity
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login process.' 
        });
    }
});

module.exports = router;