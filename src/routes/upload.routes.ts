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
  uploadController.upLoadCsv
);
router.get("/upload-jobs/:id/rows",requireAuth, requireRole("ADMIN"),uploadController.uploadJobs);
router.get("/upload-jobs/:id",requireAuth, requireRole("ADMIN"),uploadController.uploadJobsStatus);
router.put("/upload-rows/bulk-update",requireAuth, requireRole("ADMIN"),uploadController.bulkUpdate);

export default router;
