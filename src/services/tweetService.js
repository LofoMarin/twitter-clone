import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { db } from "../firebase"

// Crear un tweet
export const createTweet = async (userId, content) => {
  try {
    const tweetRef = await addDoc(collection(db, "tweets"), {
      userId,
      content,
      createdAt: serverTimestamp(),
      likes: [],
      comments: [],
    })
    return tweetRef.id
  } catch (error) {
    throw error
  }
}

// Obtener todos los tweets de un usuario
export const getUserTweets = async (userId) => {
  try {
    const q = query(collection(db, "tweets"), where("userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }))
  } catch (error) {
    throw error
  }
}

// Obtener un tweet específico
export const getTweet = async (tweetId) => {
  try {
    const tweetDoc = await getDoc(doc(db, "tweets", tweetId))
    if (!tweetDoc.exists()) {
      throw new Error("Tweet no encontrado")
    }

    return {
      id: tweetDoc.id,
      ...tweetDoc.data(),
      createdAt: tweetDoc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    throw error
  }
}

// Eliminar un tweet
export const deleteTweet = async (tweetId, userId) => {
  try {
    const tweetDoc = await getDoc(doc(db, "tweets", tweetId))
    if (!tweetDoc.exists()) {
      throw new Error("Tweet no encontrado")
    }

    if (tweetDoc.data().userId !== userId) {
      throw new Error("No tienes permiso para eliminar este tweet")
    }

    await deleteDoc(doc(db, "tweets", tweetId))
    return true
  } catch (error) {
    throw error
  }
}

// Añadir un comentario a un tweet
export const addComment = async (tweetId, userId, comment) => {
  try {
    const tweetRef = doc(db, "tweets", tweetId)
    const commentData = {
      id: Date.now().toString(),
      userId,
      content: comment,
      createdAt: new Date().toISOString(),
    }

    await updateDoc(tweetRef, {
      comments: arrayUnion(commentData),
    })

    return commentData
  } catch (error) {
    throw error
  }
}

// Eliminar un comentario de un tweet
export const deleteComment = async (tweetId, commentId, userId) => {
  try {
    const tweetDoc = await getDoc(doc(db, "tweets", tweetId))
    if (!tweetDoc.exists()) {
      throw new Error("Tweet no encontrado")
    }

    const comments = tweetDoc.data().comments || []
    const comment = comments.find((c) => c.id === commentId)

    if (!comment) {
      throw new Error("Comentario no encontrado")
    }

    if (comment.userId !== userId) {
      throw new Error("No tienes permiso para eliminar este comentario")
    }

    await updateDoc(doc(db, "tweets", tweetId), {
      comments: arrayRemove(comment),
    })

    return true
  } catch (error) {
    throw error
  }
}

// Dar/quitar like a un tweet
export const toggleLike = async (tweetId, userId) => {
  try {
    const tweetRef = doc(db, "tweets", tweetId)
    const tweetDoc = await getDoc(tweetRef)

    if (!tweetDoc.exists()) {
      throw new Error("Tweet no encontrado")
    }

    const likes = tweetDoc.data().likes || []
    const hasLiked = likes.includes(userId)

    if (hasLiked) {
      await updateDoc(tweetRef, {
        likes: arrayRemove(userId),
      })
    } else {
      await updateDoc(tweetRef, {
        likes: arrayUnion(userId),
      })
    }

    return !hasLiked
  } catch (error) {
    throw error
  }
}
