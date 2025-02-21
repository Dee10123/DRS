const express = require('express');
const router = express.Router();
const DocumentRequest = require('../models/DocumentRequest');

// ✅ Import the processRequest controller
const { processRequest } = require('../controllers/documentRequestController');

// 🚀 Route: Create a new document request
router.post('/request', async (req, res) => {
  try {
    const { documents, firstname, lastname } = req.body;

    // ✅ Validate required fields
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ message: 'Documents field is required and should be a non-empty array.' });
    }

    if (!firstname || !lastname) {
      return res.status(400).json({ message: 'Firstname and lastname are required.' });
    }

    // ✅ Create and save the document request
    const newRequest = new DocumentRequest({ documents, firstname, lastname });
    await newRequest.save();

    res.status(201).json({
      message: 'Request saved successfully.',
      request: newRequest
    });

  } catch (error) {
    console.error('❌ Error saving document request:', error);
    res.status(500).json({ message: 'Error saving document request', error: error.message });
  }
});












// ✅ Use the processRequest controller for handling request processing
router.put('/request/process/:id', processRequest);










router.put('/request/approve/:id', async (req, res) => {
  try {
      const requestId = req.params.id;

      // Find the request by ID
      const request = await DocumentRequest.findById(requestId); // Use DocumentRequest instead of Request
      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // Log to ensure request data is fetched correctly
      console.log("Request found:", request);

      // Move request data to requesthistories collection
      const requestHistory = new RequestHistory({
          requestId: request._id,
          firstname: request.firstname,
          lastname: request.lastname,
          documents: request.documents,
          dateRequested: request.dateRequested,
          status: 'Approved',
          approvedAt: new Date() // Timestamp for when it was approved
      });

      // Log before saving request history
      console.log("Saving to history:", requestHistory);

      await requestHistory.save(); // Save to requesthistories

      // Update the request status to 'Approved' and save it
      request.status = 'Approved';
      await request.save(); // Save updated request

      // Log after saving request
      console.log("Request approved and saved:", request);

      res.json({ message: 'Request successfully approved and moved to history.' });

  } catch (error) {
      console.error('Error approving request:', error); // Log the error
      res.status(500).json({ message: 'Internal server error', error: error.message }); // More detailed error response
  }
});











router.get("/history", async (req, res) => {
  try {
      const allRequests = await DocumentRequest.find();
      console.log("All Requests in Database:", allRequests); // Ipakita lahat ng laman

      const rejectedRequests = await DocumentRequest.find({ status: "Rejected" });
      console.log("Fetched Rejected Requests:", rejectedRequests);

      res.render("history", { history: rejectedRequests });
  } catch (error) {
      console.error("Error fetching rejected requests:", error);
      res.status(500).send("Server error");
  }
});







router.put('/request/reject/:id', async (req, res) => {
  try {
      const requestId = req.params.id;

      // Find the request by ID
      const request = await Request.findById(requestId);
      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // Move request data to requesthistories collection
      const requestHistory = new RequestHistory({
          requestId: request._id,
          firstname: request.firstname,
          lastname: request.lastname,
          documents: request.documents,
          dateRequested: request.dateRequested,
          status: 'Rejected',
          rejectedAt: new Date() // Timestamp for when it was rejected
      });

      await requestHistory.save(); // Save to requesthistories
      await Request.findByIdAndDelete(requestId); // Remove from requests

      res.json({ message: 'Request successfully rejected and moved to history.' });

  } catch (error) {
      console.error('Error rejecting request:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});








module.exports = router;
