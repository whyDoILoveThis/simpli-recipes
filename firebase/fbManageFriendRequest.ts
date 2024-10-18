import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { fbGetUserById } from "./fbGetUserById"; // Assumed to be a utility to fetch user details

// Function to send a friend request
export const fbSendFriendRequest = async (senderId: string, recipientId: string) => {
  try {
    // Get references for both the sender and recipient
    const senderRef = doc(db, "users", senderId);
    const recipientRef = doc(db, "users", recipientId);

    // Create a friend request object
    const friendRequest = {
      requesterId: senderId,
      status: 'pending', // Initial status as pending
      sentAt: new Date(), // Timestamp for when the request is sent
    };

    // Update the recipient's friendRequests array
    await updateDoc(recipientRef, {
      friendRequests: arrayUnion(friendRequest), // Add friend request to recipient's array
    });

    // Create a sentFriendRequest object for the sender
    const sentRequest = {
      userUid: recipientId,
      status: 'pending', // Initial status as pending
      sentAt: new Date(), // Timestamp for when the request is sent
    };

    // Update the sender's sentFriendRequests array
    await updateDoc(senderRef, {
      sentFriendRequests: arrayUnion(sentRequest), // Add sent request to sender's array
    });

    alert("Friend request sent successfully!");
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};



// Function to remove a friend request
export const fbRemoveFriendRequest = async (
  senderId: string, 
  recipientId: string, 
) => {
  try {
    // Get references for both the sender and recipient
    const senderRef = doc(db, "users", senderId);
    const recipientRef = doc(db, "users", recipientId);

    // Fetch recipient's friendRequests array
    const recipientDoc = await getDoc(recipientRef);
    const recipientData = recipientDoc.data();

    // Check if the recipient has friendRequests
    const currentRequests = recipientData?.friendRequests || [];

    // Filter out the friend request where requesterId matches senderId
    const updatedRequests = currentRequests.filter(
      (request: { requesterId: string }) => request.requesterId !== senderId
    );

    // Update the recipient's friendRequests array with the filtered list
    await updateDoc(recipientRef, {
      friendRequests: updatedRequests,
    });

    console.log("Friend request removed from recipient:", recipientId);

    // Remove the sent friend request from the sender's sentFriendRequests array
    const senderDoc = await getDoc(senderRef);
    const senderData = senderDoc.data();

    // Check if the sender has sentFriendRequests
    const currentSentRequests = senderData?.sentFriendRequests || [];

    // Filter out the sent request where recipientId matches
    const updatedSentRequests = currentSentRequests.filter(
      (request: { userUid: string }) => request.userUid !== recipientId
    );

    // Update the sender's sentFriendRequests array with the filtered list
    await updateDoc(senderRef, {
      sentFriendRequests: updatedSentRequests,
    });

    console.log("Sent friend request removed from sender:", senderId);

    alert("Friend request removed successfully!");
  } catch (error) {
    console.error("Error removing friend request:", error);
  }
};




// Function to accept a friend request
export const fbAcceptFriendRequest = async (recipientId: string, requesterId: string) => {
    try {
      const recipientRef = doc(db, "users", recipientId);
      const requesterRef = doc(db, "users", requesterId);
  
      // First, get the user objects
      const recipient = await fbGetUserById(recipientId);
      const requester = await fbGetUserById(requesterId);
  
      // Find the friend request to be accepted
      const requestToAccept = recipient?.friendRequests?.find(req => req.requesterId === requesterId);
      if (!requestToAccept) throw new Error("Friend request not found.");
  
         // Find the friend request to be accepted
      const requestToDelete = requester?.sentFriendRequests?.find(req => req.userUid === recipientId);
      if (!requestToDelete) throw new Error("Friend request not found.");
  

      // Create updated friend request objects
      const acceptedRequestForRecipient = {
        ...requestToAccept,
        status: 'accepted', // Change the status to 'accepted'
      };
  
      const acceptedRequestForRequester = {
        ...requester?.sentFriendRequests?.find(req => req.userUid === recipientId),
        status: 'accepted', // Change the status to 'accepted'
      };
  
      // 1. Add each other as friends
      await updateDoc(recipientRef, {
        friends: arrayUnion(requesterId),  // Add requester to recipient's friends list
        friendRequests: arrayRemove(requestToAccept),  // Remove the original friend request from recipient
      });
  
      await updateDoc(requesterRef, {
        friends: arrayUnion(recipientId),  // Add recipient to requester's friends list
        sentFriendRequests: arrayRemove(requestToDelete), // Remove the original sent request
      });
  
      // 2. Add the updated accepted requests back
      await updateDoc(recipientRef, {
        friendRequests: arrayUnion(acceptedRequestForRecipient), // Add the accepted request back
      });
  
      await updateDoc(requesterRef, {
        sentFriendRequests: arrayUnion(acceptedRequestForRequester), // Add the accepted request back
      });
  
      alert("Friend request accepted successfully!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };
  





// Function to reject a sent friend request
export const fbRejectFriendRequest = async (recipientId: string, requesterId: string) => {
    try {
      const senderRef = doc(db, "users", requesterId);
      const recipientRef = doc(db, "users", recipientId);
  
      const sender = await fbGetUserById(requesterId);
      const recipient = await fbGetUserById(recipientId);
  
      const sentRequest = sender?.sentFriendRequests?.find(req => req.userUid === recipientId);
      const receivedRequest = recipient?.friendRequests?.find(req => req.requesterId === requesterId);
  
      if (!sentRequest || !receivedRequest) throw new Error("Request not found.");
  
      // Update the status of the sent request to "rejected"
      await updateDoc(senderRef, {
        sentFriendRequests: arrayRemove(sentRequest),  // Remove the original request
      });
  
      await updateDoc(recipientRef, {
        friendRequests: arrayRemove(receivedRequest),  // Remove the original request
      });
  
      // Update the sender's sentFriendRequests with a new object that has the status 'rejected'
      const rejectedSentRequest = {
        ...sentRequest,
        status: 'rejected', // Change the status to rejected
    };
    
    // Update the recipient's friendRequests with a new object that has the status 'rejected'
    const rejectedReceivedRequest = {
        ...receivedRequest,
        status: 'rejected', // Change the status to rejected
      };
  
      await updateDoc(senderRef, {
        sentFriendRequests: arrayUnion(rejectedSentRequest),  // Add the rejected request back
      });
  
      await updateDoc(recipientRef, {
        friendRequests: arrayUnion(rejectedReceivedRequest),  // Add the rejected request back
      });
  
      console.log("Sent friend request rejected successfully!");
    } catch (error) {
      console.error("Error rejecting sent friend request:", error);
    }
  };
          // DELETE a friend request
          export const fbDeleteFriendRequest = async (recipientId: string, requesterId: string, status: string) => {
            try {
              const recipientRef = doc(db, "users", recipientId);
          
              // First, get the user objects
              const recipient = await fbGetUserById(recipientId);
          
              // Find the friend request to be accepted
              const requestToAccept = recipient?.friendRequests?.find(req => req.requesterId === requesterId);
              if (!requestToAccept) throw new Error("Friend request not found.");
          
              // 1. Add each other as friends
              await updateDoc(recipientRef, {
                friendRequests: arrayRemove(requestToAccept),  // Remove the friend request from recipient
              });
          
              
          
              alert("Friend request DELETED successfully!");
            } catch (error) {
              console.error("Error deleting friend request:", error);
            }
          };


           // DELETE a friend request
           export const fbDeleteSentRequest = async (recipientId: string, requesterId: string, status: string) => {
            try {
              const requesterRef = doc(db, "users", requesterId);
          
              // First, get the user objects
              const requester = await fbGetUserById(requesterId);
          
              // Find the friend request to be accepted
              const requestToAccept = requester?.sentFriendRequests?.find(req => req.userUid === recipientId);
              if (!requestToAccept) throw new Error("Friend request not found.");
          
              
          
              await updateDoc(requesterRef, {
                sentFriendRequests: arrayRemove({ userUid: recipientId, status: status, sentAt: requestToAccept.sentAt }),
              });
          
              alert("Friend request DELETED successfully!");
            } catch (error) {
              console.error("Error deleting friend request:", error);
            }
          };

           // DELETE a friend request
           export const fbStopSentRequest = async (recipientId: string, requesterId: string, status: string) => {
            try {
              const requesterRef = doc(db, "users", requesterId);
          
              // First, get the user objects
              const requester = await fbGetUserById(requesterId);
               // First, get the user objects
               const recipient = await fbGetUserById(recipientId);
          
              // Find the friend request to be accepted
              const sentRequestToDelete = requester?.sentFriendRequests?.find(req => req.userUid === recipientId);
              if (!sentRequestToDelete) throw new Error("Friend request not found.");

               // Find the friend request to be accepted
               const requestToDelete = recipient?.friendRequests?.find(req => req.requesterId === requesterId);
               if (!requestToDelete) throw new Error("Friend request not found.");
          
              await updateDoc(requesterRef, {
                friendRequests: arrayRemove({ userUid: requesterId, status: status, sentAt: requestToDelete.sentAt }),
              });
          
          
              await updateDoc(requesterRef, {
                sentFriendRequests: arrayRemove({ userUid: recipientId, status: status, sentAt: sentRequestToDelete.sentAt }),
              });
          
              alert("Friend request DELETED successfully!");
            } catch (error) {
              console.error("Error deleting friend request:", error);
            }
          };
  
  