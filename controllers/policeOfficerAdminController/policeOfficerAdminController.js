const db =require("../../database/createDataBase");
const bcrypt = require("bcrypt");

// @desc    Register a new police officer admin
// @route   POST /api/adminside/register
// @access  Private

const registerNewPoliceOfficer = async (req, res) => {
    const {
        policeOfficerFname,
        policeOfficerMname,
        policeOfficerLname,
        profilePicture,
        policeOfficerRoleName,
        policeOfficerStatus,
        policeOfficerPhoneNumber,
        passwordText,
        policeOfficerGender,
        policeOfficerBirthdate,
        role,// 1 for town admin 2 for zone admin 3 for region admin 4 for root admin
        policeStationId
    } = req.body;
    
    // Input validation
    if (!policeOfficerFname || !policeOfficerLname || !policeStationId) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, and police station ID are required"
        });
    }

    try {
        // Check if police station exists
        const stationCheck =await db.sql(`SELECT policeStationId FROM policeStation WHERE policeStationId = ${policeStationId}`);
        
        if (!stationCheck) {
            return res.status(404).json({
                success: false,
                message: "Police station not found"
            });
        }
            // Hash the password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(passwordText, saltRounds);
            const policeOfficerId = require("../../helper/policeOfficer/generatePoliceOfficerId");
            const id=policeOfficerId();
            // Insert into database
            const statement =await db.sql(`
                INSERT INTO policeOfficer (
                    policeOfficerId,
                    policeOfficerFname,
                    policeOfficerMname,
                    policeOfficerLname,
                    profilePicture,
                    policeOfficerRoleName,
                    policeOfficerStatus,
                    policeOfficerPhoneNumber,
                    policeOfficerGender,
                    policeOfficerBirthdate,
                    passwordText,
                    role,
                    policeStationId
                ) VALUES (${id} ,${policeOfficerFname}, ${policeOfficerMname}, ${policeOfficerLname}, ${profilePicture}, ${policeOfficerRoleName}, ${policeOfficerStatus}, ${policeOfficerPhoneNumber}, ${policeOfficerGender}, ${policeOfficerBirthdate}, ${passwordHash}, ${role}, ${policeStationId});
            `);
            if (result.changes > 0) {
                return res.status(201).json({
                    message: "Police officer registered successfully",
                    name:policeOfficerFname
                });
            } else {
                return res.status(500).json({ message: "Failed to insert data" });
            }
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Error in data insertion", error: error.message });
        }
};





//@update police officer information in the database only with our police station id
//@route PUT /api/police/updatePoliceOfficer/:id
//@access point for know public
const updatePoliceOfficerInfo = async (req, res) => {
    const {
        policeStationId,
        policeOfficerFname,
        policeOfficerMname,
        policeOfficerLname,
        profilePicture,
        policeOfficerRoleName,
        policeOfficerStatus,
        policeOfficerPhoneNumber,
        policeOfficerBirthdate,
        policeOfficerGender,
        passwordText
    } = req.body;
    const { id } = req.params; // Extract policeOfficerId from request parameters
    console.log(id);
    console.log(req.body);
    if (req.user.role < 2) {
        return res.status(403).json({ message: "Forbidden: Only admins can edit police officers" });
    }
    try {
        // Hash the password (use either hash or hashSync, not both)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(passwordText, saltRounds);

        const statement = await db.prepare(`UPDATE policeOfficer SET 
            policeOfficerFname = ${policeOfficerFname},
            policeOfficerMname = ${policeOfficerMname},
            policeOfficerLname = ${policeOfficerLname}},
            profilePicture = ${profilePicture}, 
            policeOfficerRoleName = ${policeOfficerRoleName},
            policeOfficerStatus = ${policeOfficerStatus},
            policeOfficerPhoneNumber = ${policeOfficerPhoneNumber},
            passwordText = ${passwordHash},
            policeOfficerBirthdate = ${policeOfficerBirthdate},
            policeOfficerGender = ${policeOfficerGender},
            policeStationId = ${policeStationId}
            WHERE policeOfficerId = ${id}`);

        if (result.changes > 0) {
            res.status(200).json({
                message: "Police officer updated successfully",
                name: policeOfficerFname
            });
        } else {
            res.status(404).json({
                message: "No police officer found with that ID"
            });
        }
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            message: "Error updating police officer",
            error: error.message
        });
    }
};
// //@desc Add sub police Station in the database
// //@route POST 
// //@access point for know public

const addSubPoliceStation = async (req,res)=>{
    const rootId=1;
    const policeStationId = require("../../helper/policeOfficer/generatePoliceStationId");
    const id=policeStationId();
   const photoFileName = req.file ? req.file.filename : null;
   console.log(req.body);
   console.log(photoFileName);
   console.log(policeStationId)
    try {
        const {nameOfPoliceStation,policeStationPhoneNumber,secPoliceStationPhoneNumber,townId,subCityId}=req.body;
        

    const ourStatment =await db.sql(`INSERT INTO policeStation(policeStationId,nameOfPoliceStation,policeStationPhoneNumber,secPoliceStationPhoneNumber,PoliceStationLogo,townId,subCityId,rootId) VALUES (${id},${nameOfPoliceStation},${policeStationPhoneNumber},${secPoliceStationPhoneNumber},${photoFileName},${townId},${subCityId},${rootId})`)
    res.status(201);
    res.json({"message":"data inserted successfully"});
} catch (error) {
       console.log(error);
       res.status(400);
       res.json({"message":"error in data insertion"});
    }
    console.log(req.body)
    
}

// //@desc send message to the user
// //@route Post /api/police/message/sendmessage
// //@access point for know public

const sendMessage = async(req, res) => {
    try {
        const { sendersId, reciversId, message } = req.body;
        
        // Validate input
        if (!sendersId || !reciversId || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Insert message
        const insertStatement =await db.sql(`INSERT INTO message (sendersId, reciversId, message) VALUES (${sendersId}, ${reciversId}, ${message})`);

        // Verify insertion
        if (insertStatement.changes === 0) {
            return res.status(500).json({ error: "Failed to send message" });
        }

        const lookupStatement =await db.sql(`SELECT * FROM message WHERE id = ${insertStatement.lastInsertRowid}`);

        if (!lookupStatement) {
            return res.status(500).json({ error: "Message sent but could not be retrieved" });
        }

        // Return success response with the sent message
        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: lookupStatement
        });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// //@desc alerts the police officer in the area about possable sight
// //@route POST /api/police/alert/areaalert
// //@access point for know public

const alertInTheArea = async(req, res) => {
    const { policeStationId } = req.body;
    
    // Validate townId is provided
    if (!policeStationId) {
        return res.status(400).json({
            error: "You Must Be a Member of amhara police force is required"
        });
    }

    try {
        const lookupStatement =await db.sql(`
            SELECT * FROM alert 
            WHERE localPoliceStationId = ${policeStationId}
            ORDER BY createdAt DESC
        `);
        
        // If no alerts found, return a message
        if (lookupStatement.length === 0) {
            return res.json({
                message: "No active alerts in this area",
                count: 0,
                data: []
            });
        }

        res.json({
            count: lookupStatement.length,
            data: lookupStatement
        });

    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({
            error: "Internal server error while fetching alerts"
        });
    }
};

const postAlert =async(req,res)=>{
    const{policeStationId}= req.body;
    if(!policeStationId){
        return res.status(400).json({
            error:"You Must Be a Member of amhara police force"
        });
    }
    try {
        const lookupStatement =await db.sql(`SELECT * FROM alert WHERE postPoliceStationId = ${policeStationId}`)
        const alertsInPost =await lookupStatement;
        if(alertsInPost.length === 0){
            return res.json({
                message:"No active alerts in the posts you added",
                count:0,
                data:[]
            });
        }
        res.json({
            count: alertsInPost.length,
            data: alertsInPost
            });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({
            error: "Internal server error while fetching alerts"
        });
        
    }
   
}
// //@desc alert the police station that added the post about possabil sight
// //@route POST /api/police/postpolicestationalert
// //@access point for know public
const viewReportForSpecificPost =async (req, res) => {
    const { postId } = req.body;

    // Validate postId is provided
    if (!postId) {
        return res.status(400).json({
            success: false,
            error: "postid is required"
        });
    }

    try {
        // Get all reports for the specified post
        const lookupStatement =await db.sql(`
            SELECT * FROM report 
            WHERE postId = ${postId}
            ORDER BY reportDate DESC
        `);
        const reports =await lookupStatement;

        // If no reports found
        if (reports.length === 0) {
            return res.json({
                success: true,
                message: "No reports found for this post",
                count: 0,
                data: []
            });
        }

        res.json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {
        console.error("Error fetching reports for post:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error while fetching reports"
        });
    }
};
const getPoliceStations = async(req, res) => {
    const { rootId } = req.body;
    // Validate townId is provided
    console.log(rootId);
    if (!rootId) {
        return res.status(400).json({
            error: "Root ID is required"
        });
    }

    try {
        const lookupStatement =await db.sql(`
            SELECT policeStation.*, town.*
            FROM policeStation
            JOIN town ON policeStation.townId = town.townId
            WHERE policeStation.rootId = ${rootId};
        `);
        console.log(lookupStatement);
        const stations = await lookupStatement;
        console.log(stations);

        // If no stations found 
        if (stations.length === 0) {
            return res.json({
                message: "No police stations found in this town",
                count: 0,
                data: []
            });
        }

        res.json({
            count: stations.length,
            data: stations
        });

    }
    catch (error) {
        console.error("Error fetching police stations:", error);
    }
};
// new here
//@desc get all police officer information in the database
// //@route GET /api/police/getAllPoliceOfficer
//@access point for know public
const getAllPoliceOfficerInOurPoliceStation =async (req, res) => {
    const { policeStationId } = req.body;
    // // Validate policeStationId is provided
    // console.log(policeStationId);
    // console.log("policeStationId");
    if (!policeStationId) {
        return res.status(400).json({
            success: false,
            error: "policeStationId is required in the request body"
        });
    }

    try {
        // Get all officers for the specified police station
        const statement =await db.sql(`
            SELECT *
            FROM policeOfficer 
            WHERE policeStationId = ${policeStationId}
        `);
        const officers =await statement;

        // If no officers found
        if (officers.length === 0) {
            return res.json({
                success: true,
                message: "No officers found in this police station",
                count: 0,
                data: []
            });
        }

        res.json({
            success: true,
            count: officers.length,
            data: officers
        });

    } catch (error) {
        console.error("Error fetching police officers:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error while fetching officers data"
        });
    }
};
//@desc get all police station information in the database were we added the police station
//@route GET /api/police/getAllPoliceStation
//@access point for know public
const getSpecificPoliceStationInfo =async (req, res) => {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            success: false,
            error: "Valid police station ID is required in the URL parameters"
        });
    }

    try {
        // Get specific police station with selected columns
        const statement =await db.sql(`
            SELECT 
                nameOfPoliceStation,
                policeStationPhoneNumber,
                secPoliceStationPhoneNumber,
                policeStationLogo,
                townId,
                subCityId,
                rootId
            FROM policeStation 
            WHERE policeStationId = ${id}
        `);
        
        const station =await statement;

        // If station not found
        if (!station) {
            return res.status(404).json({
                success: false,
                error: "Police station not found with the provided ID"
            });
        }
        const { nameOfPoliceStation, policeStationPhoneNumber, secPoliceStationPhoneNumber, policeStationLogo, townId, subCityId, rootId } = station;
        const sqlTownTable =await db.sql`SELECT * FROM town WHERE townId = ${townId}`;
        const sqlSubCityTable =await db.sql`SELECT subCityName FROM subCity WHERE subCityId = ${subCityId}`;
        const sqlRootTable =await db.sql`SELECT username FROM root WHERE rootId = ${rootId}`;

        const town =await sqlTownTable;
        const subCity =await sqlSubCityTable;
        const root =await sqlRootTable;
        // Return the police station data
        res.status(200).json({
            success: true,
            data: station,
            townName: town.townName,
            subCityName: subCity.subCityName,
            rootUsername: root.username,
        });

    } catch (error) {
        console.error(`Error fetching police station with ID ${id}:`, error);
        res.status(500).json({
            success: false,
            error: "Internal server error while fetching police station data",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
//@ get all posts which the police officer added in the database
//@route GET /api/police/getAllPosts
//@access point for know public
const getAllPosts = async(req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Validate ID parameter
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            success: false,
            error: "Valid police station ID is required"
        });
    }

    try {
        const countStmt =await db.sql(`
            SELECT COUNT(*) as total 
            FROM post 
            WHERE policeStationId = ${id} AND postStatus = 1
        `);
        const {total} = countStmt;

        // Get paginated posts
        const statement =await db.sql(`
            SELECT 
                postId,
                townId,
                firstName,
                middleName,
                lastName,
                age,
                lastLocation,
                gender,
                policeOfficerId,
                personStatus,
                imagePath,
                createdAt
            FROM post 
            WHERE policeStationId = ${id} AND postStatus = 1
            ORDER BY createdAt DESC
            LIMIT ${limit} OFFSET ${offset}
        `);
        
        const posts =await statement;

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            data: posts
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error while fetching posts",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
//@desc get spacific post information in the database
//@route GET /api/police/getPosts:id
//@access point for know public
const getSpecificPost =async (req, res) => {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            success: false,
            error: "Valid post ID is required"
        });
    }

    try {
        // Get specific post with selected columns
        const statement =await db.sql(`
            SELECT 
                postId,
                townId,
                subCityId,
                postDescription,
                firstName,
                middleName,
                lastName,
                age,
                lastLocation,
                gender,
                policeOfficerId,
                policeStationId,
                postStatus,
                personStatus,
                imageUrl,
                created_at
            FROM posts 
            WHERE postId = ${id}
        `);
        
        const post =await statement;

        // If post not found
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found with the provided ID"
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });

    } catch (error) {
        console.error(`Error fetching post with ID ${id}:`, error);
        res.status(500).json({
            success: false,
            error: "Internal server error while fetching post",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
//@desc add post to the database
//@route POST /api/police/addPost
//@access point for know public
const addPost = async(req, res) => {
    const {
        townId,
        subCityId,
        postDescription,
        firstName,
        middleName,
        lastName,
        age,
        lastLocation,
        gender,
        policeOfficerId,
        policeStationId,
        postStatus,
        personStatus,
        imageUrl} = req.body;
    // Validate required fields
    if (!townId || !firstName || !lastName || !policeStationId ||!postDescription ||!middleName) {
        return res.status(400).json({
            success: false,
            error: "townId, firstName, lastName, and policeStationId are required"
        });
    }
    try {
        
        const statement =await db.sql(`INSERT INTO post(
        townId,
        subCityId,
        postDescription,
        firstName,
        middleName,
        lastName,
        age,
        lastLocation,
        gender,
        policeOfficerId,
        policeStationId,
        postStatus,
        personStatus,
        imageUrl) VALUES(${townId},${subCityId},${postDescription},${firstName},${middleName},${lastName},${age},${lastLocation},${gender},${policeOfficerId},${policeStationId},${postStatus},${personStatus},${imageUrl})`);
        const result =await statement;
        if (result.changes > 0) {
            return res.status(201).json({
                success: true,
                message: "Post added successfully",
                postId: result.lastInsertRowid
            });
        } else {
            return res.status(500).json({
                success: false,
                error: "Failed to add post"
            });
        }
    } catch (error) {
        console.error("Error adding post:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error while adding post",
        });
        
    }
}
const editPost = async (req, res) => {
    const { postId } = req.params;
    const {
        townId,
        subCityId,
        postDescription,
        firstName,
        middleName,
        lastName,
        age,
        lastLocation,
        gender,
        policeOfficerId,
        policeStationId,
        postStatus,
        personStatus,
        imageUrl
    } = req.body;

    if (!postId || isNaN(Number(postId))) {
        return res.status(400).json({
            success: false,
            error: "Valid post ID is required"
        });
    }

    if (!townId || !firstName || !lastName || !policeStationId || !postDescription) {
        return res.status(400).json({
            success: false,
            error: "townId, firstName, lastName, policeStationId, and postDescription are required"
        });
    }

    try {
        // First check if post exists
        const checkStmt =await db.sql(`SELECT postId FROM post WHERE postId = ${postId}`);
        const existingPost =await checkStmt;

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                error: "Post not found with the provided ID"
            });
        }

        // Update the post
        const updateStmt =await db.sql(`
            UPDATE posts SET
                townId = ${townId},
                subCityId = ${subCityId},
                postDescription = ${postDescription},
                firstName = ${firstName},
                middleName = ${middleName},
                lastName = ${lastName},
                age = ${age},
                lastLocation = ${lastLocation},
                gender = ${gender},
                policeOfficerId = ${policeOfficerId},
                policeStationId = ${policeStationId},
                postStatus = ${postStatus || 1},
                personStatus = ${personStatus || 'unknown'},
                imageUrl = ${imageUrl}
            WHERE postId = ${postId};
        `);

        const result =await updateStmt;

        if (result.changes === 0) {
            return res.status(500).json({
                success: false,
                error: "Failed to update post"
            });
        }

        // Get the updated post to return
        const getStmt =await db.sql(`SELECT * FROM posts WHERE postId = ${postId}`);
        const updatedPost =await getStmt;

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });

    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error while updating post",
            
        });
    }
};
const getAllPoliceStationInfo =async (req, res) => {
    try {
                const rootId = req.user.rootId; // Assuming you have middleware to set req.user
        const statement =await db.sql(`SELECT * FROM policeStation WHERE rootId = ${rootId}`);
        const stations =await statement;

        if (stations.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No police stations found"
            });
        }

        res.status(200).json({
            success: true,
            count: stations.length,
            data: stations
        });

    } catch (error) {
        console.error("Error fetching police stations:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error while fetching police stations",
            
        });
    }
};

const deletePoliceStation =async (req, res) => {
    const { policeStationId } = req.body;

    // Validate ID parameter
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            success: false,
            error: "Valid police station ID is required"
        });
    }

    try {
        // Delete the police station
        const statement =await db.sql(`DELETE FROM policeStation WHERE policeStationId = ${policeStationId}`);
        const result = await statement;

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: "Police station not found with the provided ID"
            });
        }

        res.status(200).json({
            success: true,
            message: "Police station deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting police station:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error while deleting police station",
            
        });
    }
};
module.exports={
    addPost,
    editPost,
    getAllPosts,
    getSpecificPost,
    getSpecificPoliceStationInfo,
    getAllPoliceOfficerInOurPoliceStation,
    postAlert,
    alertInTheArea,
    sendMessage,
    addSubPoliceStation,
    updatePoliceOfficerInfo,
    registerNewPoliceOfficer,
    viewReportForSpecificPost,
    getAllPoliceStationInfo,
    deletePoliceStation,
    getPoliceStations
}