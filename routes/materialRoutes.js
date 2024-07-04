const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");

router.get("/materials", materialController.getAllMaterials);

router.post("/materials", materialController.addMaterial);

router.put("/materials/:id", materialController.updateMaterial);

router.delete("/materials/:id", materialController.deleteMaterial);

module.exports = router;
