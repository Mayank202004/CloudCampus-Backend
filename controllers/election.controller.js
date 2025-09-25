import Election from "../models/election.models.js";
import axios from 'axios';
import Student from "../models/student.models.js";


// @desc    Create a new election
// @route   POST /api/elections
// @access  Private (Faculty only)
export const createElection = async (req, res) => {
  try {
    const { electionName, description, startDate, endDate } = req.body;

    if (!electionName || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newElection = new Election({
      electionName,
      description,
      startDate,
      endDate,
    });

    await newElection.save();
    res.status(200).json({ message: "Election created successfully", election: newElection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getElectionInfo = async (req, res) => {
  try {
    const currentDate = new Date();
    const elections = await Election.findOne({ endDate: { $gt: currentDate } });
    res.status(200).json({ elections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @desc Get election and candidates details
 * @returns {Object} Election details
 * @access Public
 */
export const getElectionDetails = async (req, res) => {
  try {
    // 1. Fetch positions from blockchain server
    const response = await axios.get(`${process.env.BLOCKCHAIN_URL}/positionsWithCandidates`);
    const data = response.data;

    if (!data.success) {
      return res.status(500).json({ message: "Failed to fetch positions from blockchain" });
    }

    // 2. Enrich candidateUIDs with student details
    const positions = await Promise.all(
      data.positions.map(async (pos) => {
        const candidates = await Student.find(
          { _id: { $in: pos.candidateUIDs } },
          "name registrationNo profilePhoto email department" 
        ).lean();

    const {positionId, positionName} = pos;
        return {
          positionId,
          positionName,
          candidates,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Election details fetched successfully",
      positions,
    });
  } catch (error) {
    console.error("getElectionDetails error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const voteForElection = async (req, res) => {
  try {
    const { positionId, candidateId } = req.body;
    const voterAddress = req.student.blockchainAddress;

    const result = await axios.post('http://192.168.40.63:5000/vote', { positionId, candidateId, voterAddress })
      .then((res) => {
        return res;
      })

    res.status(200).json({ message: "Voted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}