"use server"

import {CreateBook, TextSegment} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import {generateSlug, serializeData} from "@/lib/utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment";

export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase()

        const slug = generateSlug(data.title)

        // Check if a book with the same slug already exists
        const existingBook = await Book.findOne({slug}).lean()
        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true
            }
        }

        // Todo: Check subscription limits before creating a book

        // Create a new book
        const book = await Book.create({...data, slug, totalSegments: 0})

        return {
            success: true,
            data: serializeData(book)
        }
    } catch (error) {
        console.error("Error creating a  book", error)
        return {
            success: false,
            error
        }
    }
}

export const saveBookSegments = async (bookId: string, clerkID: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase()

        console.log("Saving book segments")

        const segmentsToInsert = segments.map(({text, segmentIndex, pageNumber, wordCount}) => ({
            clerkID, bookId, content: text, segmentIndex, pageNumber, wordCount
        }))

        await BookSegment.insertMany(segmentsToInsert)

        await Book.findByIdAndUpdate(bookId, {totalSegments: segments.length})

        console.log("Successfully saved segments")

        return {
            success: true,
            data: { segmentsCreated: segments.length}
        }
    } catch (error) {
        console.error("Error saving book segments", error)

        await BookSegment.deleteMany({bookId})
        await Book.findByIdAndDelete(bookId)
        console.log("Deleted book segments and book due to failure to save segments")
        return {
            success: false,
            error
        }
    }
}

export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase()

        const slug = generateSlug(title)

        const existingBook = await Book.findOne({slug}).lean()

        if (existingBook) {
            return {
                exists: true,
                book: serializeData(existingBook)
            }
        }

        return {
            exists: false,
        }
    } catch (error) {
        console.error("Error checking book exists", error)
        return {
            exists: false,
            error
        }
    }
}