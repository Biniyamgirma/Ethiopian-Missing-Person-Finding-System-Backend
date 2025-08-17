const db = require("../../database/createDataBase");
const authMiddleware = require('../../middleware/authMiddleware');
const rbacMiddleware = require('../../middleware/rbacMiddleware');
const { post } = require("../../routes/policeOfficerAdminRoute/policeOfficerAdminRoute");
 
const addPost = async (req, res) => {

    try {
        const { townId,
            subCityId,
            postDescription,
            firstName,
            middelName,
            lastName,
            age,
            lastLocation,
            gender,
            policeOfficerId,
            policeStationId,postStatus,personStatus,imagePath} = req.body;
    
        // Get image path from multer if a file was uploaded
        const uploadedImagePath = req.file ? req.file.filename : null;

        // Insert the new post into the database
        const result =await db.sql(`
        INSERT INTO post (
        townId, subCityId, postDescription, 
        firstName,middleName, lastName, age, lastLocation,
        gender,policeOfficerId,policeStationId,
        postStatus,personStatus,imagePath)
        VALUES (${townId}, ${subCityId}, '${postDescription}', 
        '${firstName}','${middelName}', '${lastName}','${age}', '${lastLocation}',
        '${gender}','${policeOfficerId}','${policeStationId}',
        ${postStatus},'${personStatus}','${uploadedImagePath}')
        `); 
    
        res.status(201).json({ message: "Post created successfully", postId: result.lastInsertRowid });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    }
const getAllPostInCity = async (req, res) => {
    try {
        const { townId } = req.body;
        // const userId = req.user.userId; // Assuming you have userId in the request object
    
        // Fetch all posts from the database
        const posts =await db.sql(`
            SELECT * FROM post WHERE townId = ${townId} AND postStatus = 1;
        `);
    
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getAllPostInZone = async (req, res) => {
    try {
        const { zoneId } = req.body;
        
        const posts =await db.sql(`
             SELECT 
                    p.*,
                    t.townName,
                    t.zoneName,
                    t.regionName,  
                    po.policeOfficerFname,
                    po.policeOfficerMname,
                    po.policeOfficerLname,
                    po.policeOfficerRoleName,
                    ps.nameOfPoliceStation
                FROM 
                    post p
                JOIN 
                    zonePost r ON p.postId = r.postId
                JOIN 
                    town t ON p.townId = t.townId
                LEFT JOIN 
                    policeOfficer po ON p.policeOfficerId = po.policeOfficerId
                LEFT JOIN 
                    policeStation ps ON p.policeStationId = ps.policeStationId
                WHERE 
                    r.zoneId = ${zoneId} AND p.postStatus = 1
        `);
    
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getAllPostInRegion = async (req, res) => {
    try {
        const { regionId } = req.body;
        // const userId = req.user.userId; // Assuming you have userId in the request object
    
        // Fetch all posts from the database
        const posts =await db.sql(`
            SELECT 
                    p.*,
                    t.townName,
                    t.zoneName,
                    t.regionName,  
                    po.policeOfficerFname,
                    po.policeOfficerMname,
                    po.policeOfficerLname,
                    po.policeOfficerRoleName,
                    ps.nameOfPoliceStation
                FROM 
                    post p
                JOIN 
                    regionPost r ON p.postId = r.postId
                JOIN 
                    town t ON p.townId = t.townId
                LEFT JOIN 
                    policeOfficer po ON p.policeOfficerId = po.policeOfficerId
                LEFT JOIN 
                    policeStation ps ON p.policeStationId = ps.policeStationId
                WHERE 
                    r.regionId = ${regionId} AND p.postStatus = 1
           
        `);
    
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllPostInCountry = async (req, res) => {
    try {
        const { countryId } = req.body;
        // const userId = req.user.userId; // Assuming you have userId in the request object
    
        // Fetch all posts from the database
        const posts =await db.sql(`
           SELECT 
                    p.*,
                    t.townName,
                    t.zoneName,
                    t.regionName,  
                    po.policeOfficerFname,
                    po.policeOfficerMname,
                    po.policeOfficerLname,
                    po.policeOfficerRoleName,
                    ps.nameOfPoliceStation
                FROM 
                    post p
                JOIN 
                    countryPost r ON p.postId = r.postId
                JOIN 
                    town t ON p.townId = t.townId
                LEFT JOIN 
                    policeOfficer po ON p.policeOfficerId = po.policeOfficerId
                LEFT JOIN 
                    policeStation ps ON p.policeStationId = ps.policeStationId
                WHERE 
                    r.countryId = ${countryId} AND p.postStatus = 1
           
        `);
    
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const addPostToZoneTable = async (req, res) => {
    try {
        const { zoneId, postId } = req.body;
        const result =await db.sql(`
            INSERT INTO zonePost (zoneId, postId)
            VALUES (${zoneId}, ${postId})
        `); 
    
        res.status(201).json({ message: "Post added to zone successfully", postId: result.lastInsertRowid });
    } catch (error) {
        console.error("Error adding post to zone:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const addPostToRegionTable = async (req, res) => {
    try {
        const { regionId, postId } = req.body;
        const result =await db.sql(`
            INSERT INTO regionPost (regionId, postId)
            VALUES (${regionId}, ${postId})
        `); 
        res.status(201).json({ message: "Post added to region successfully", postId: result.lastInsertRowid });
    } catch (error) {
        console.error("Error adding post to region:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const addPostToCountryTable = async (req, res) => {
    try {
        const { countryId, postId } = req.body;
        // const userId = req.user.userId; // Assuming you have userId in the request object
    
        // Insert the new post into the database
        const result =await db.sql(`
            INSERT INTO countryPost (countryId, postId)
            VALUES (${countryId}, ${postId})
        `); 
    
        res.status(201).json({ message: "Post added to country successfully", postId: result.lastInsertRowid });
    } catch (error) {
        console.error("Error adding post to country:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const editPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { townId,
            subCityId,
            postDescription,
            firstName,
            middleName,
            lastName,
            age,
            lastLocation,
            gender,
            policeOfficerId,
            policeStationId,postStatus,personStatus} = req.body;
        // const userId = req.user.userId; // Assuming you have userId in the request object
        const result =await db.sql(`
            UPDATE post
            SET townId = ${townId}, subCityId = ${subCityId}, postDescription = '${postDescription}', 
            firstName = '${firstName}', middleName = '${middleName}', lastName = '${lastName}', age = '${age}', 
            lastLocation = '${lastLocation}' , gender = '${gender}', policeOfficerId = '${policeOfficerId}',
            policeStationId = '${policeStationId}', postStatus = ${postStatus}, personStatus = '${personStatus}'
            WHERE postId = ${postId} ;
        `);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post updated successfully" });
    }
    catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const result =await db.sql(`
            DELETE FROM regionPost WHERE postId = ${postId};
        `);
        const result2 =await db.sql(`
            DELETE FROM zonePost WHERE postId = ${postId};
        `);
        const result3 =await db.sql(`
            DELETE FROM zonePost WHERE postId = ${postId}
        `);
    
        // 
    
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

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
const cheackPostInZone = async (req, res) => {
    try {
        const { postId } = req.params;
        const result =await db.sql(`SELECT * FROM zonePost WHERE postId = ${postId}`);
        if (result) {
            return res.status(200).json({ message: "Post found in zone",success:true });
        } else {
            return res.status(404).json({ message: "Post not found in zone",success:false });
        }
    } catch (error) {
        console.error("Error checking post ");
    }
}

const cheackPostInRegion = async (req, res) => {
    try {
        const { postId } = req.params;
        const result =await db.sql(`SELECT * FROM regionPost WHERE postId = ${postId}`);
        if (result) {
            return res.status(200).json({ message: "Post found in region",success:true });
        }else {
            return res.status(404).json({ message: "Post not found in region",success:false });
        }
    } catch (error) {
        console.error("Error checking post ");
    }
}
const cheackPostInCountry = async (req, res) => {
    try {
        const { postId } = req.params;
        const result =await db.sql(`SELECT * FROM countryPost WHERE postId = ${postId}`);
        if (result) {
            return res.status(200).json({ message: "Post found in country",success:true });
        }else {
            return res.status(404).json({ message: "Post not found in country",success:false });
        }
    } catch (error) {
        console.error("Error checking post ");
    }
}

        
const getPoliceStationPost = async (req, res) => {
    try {
        const { policeStationId } = req.body;
        // const userId = req.user.userId; // Assuming you have userId in the request object
    
        // Fetch all posts from the database
        const posts =await db.sql(`
            SELECT * FROM post WHERE policeStationId = '${policeStationId}';
        `);
    
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    addPost,
    getAllPostInCity,
    getAllPostInZone,
    getAllPostInRegion,
    addPostToZoneTable,
    addPostToRegionTable,
    editPost,
    deletePost,
    getSpecificPost,
    getPoliceStationPost,
    cheackPostInZone,
    cheackPostInRegion,
    addPostToCountryTable,
    cheackPostInCountry,
    getAllPostInCountry
}

// const getAllPostInCountry = async (req, res) => {
//     try {
//         // const { regionId } = req.body;
//         // const userId = req.user.userId; // Assuming you have userId in the request object
    
//         // Fetch all posts from the database
//         const posts = db.prepare(`
//             SELECT * FROM post 
//         `).all();
    
//         res.status(200).json({ posts });
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }