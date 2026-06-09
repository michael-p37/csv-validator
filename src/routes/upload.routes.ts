import { uploadController } from "@/controllers/csv-upload.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/csv-upload.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { Router } from "express";

const router = Router();

router.post( 
  "/upload", 
  requireAuth, 
  requireRole("ADMIN"), 
  upload.single("csv"), 
  uploadController.loadCsv
);

export default router;
