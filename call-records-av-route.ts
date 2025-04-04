src/app/api/call-records-av/route.ts





import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

// Initial registration schema (Phase 1)
const initialCallRecordSchema = z.object({
  member_id: z.string(),
  team_id: z.string(),
  session_id: z.string(),
});

// Complete call record schema (Phase 2)
const completeCallRecordSchema = z.object({
  // Required fields
  session_id: z.string(),
  
  // Optional fields - some or all of these might be included in the update
  member_id: z.string().optional(),
  team_id: z.string().optional(),
  
  // User & Bot information - optional in case of partial updates
  bot_name: z.string().optional(),
  bot_picture: z.string().optional(),
  user_name: z.string().optional(),
  user_picture: z.string().optional(),
  
  // Scores
  average_score: z.number().optional(),
  engagement_score: z.number().optional(),
  objection_handling_score: z.number().optional(),
  information_gathering_score: z.number().optional(),
  program_explanation_score: z.number().optional(),
  closing_skills_score: z.number().optional(),
  effectiveness_score: z.number().optional(),
  notes_score: z.number().optional(),
  listening_skills_score: z.number().optional(),
  
  // Call metadata
  call_date: z.string().optional(), // Will be parsed to timestamp
  call_length: z.string().optional(),
  
  // Score descriptions
  engagement_text: z.string().optional(),
  objection_handling_text: z.string().optional(),
  information_gathering_text: z.string().optional(),
  program_explanation_text: z.string().optional(),
  closing_skills_text: z.string().optional(),
  effectiveness_text: z.string().optional(),
  
  // Analysis content
  power_moment: z.string().optional(),
  key_wins: z.string().optional(),
  areas_for_growth: z.string().optional(),
  call_notes: z.string().optional(),
  managers_feedback: z.string().optional(),
  call_recording: z.string().optional(),
  call_transcript: z.string().optional(),
  
  // Language analysis
  bot_talk_percentage: z.number().optional(),
  user_talk_percentage: z.number().optional(),
  monologues_time: z.string().optional(),
  response_time: z.string().optional(),
  turn_switches: z.number().optional(),
  most_used_phrases: z.string().optional(),
  speaking_pace: z.number().optional(),
  average_sentence_length: z.number().optional(),
  filler_words_percentage: z.number().optional(),
  filler_words_used: z.string().optional(),
  listening_skills_analysis: z.string().optional(),
  
  // Status
  status: z.enum(['pending', 'completed']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the initial payload
    const validatedData = initialCallRecordSchema.parse(body);
    
    // Create the basic record with required fields
    const result = await sql`
      INSERT INTO call_records_av (
        member_id, team_id, session_id, status
      ) VALUES (
        ${validatedData.member_id}, 
        ${validatedData.team_id}, 
        ${validatedData.session_id},
        'pending'
      )
      ON CONFLICT (session_id) 
      DO UPDATE SET 
        status = 'pending',
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, call_number, session_id, status
    `;
    
    return NextResponse.json({
      message: 'Call record initialized',
      data: result.rows[0]
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating call record:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      message: 'Error creating call record',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const member_id = searchParams.get('member_id');
    const team_id = searchParams.get('team_id');
    const session_id = searchParams.get('session_id');
    const status = searchParams.get('status');
    
    let query = 'SELECT * FROM call_records_av';
    const conditions = [];
    const values: any[] = [];
    
    if (member_id) {
      conditions.push(`member_id = $${values.length + 1}`);
      values.push(member_id);
    }
    
    if (team_id) {
      conditions.push(`team_id = $${values.length + 1}`);
      values.push(team_id);
    }
    
    if (session_id) {
      conditions.push(`session_id = $${values.length + 1}`);
      values.push(session_id);
    }
    
    if (status) {
      conditions.push(`status = $${values.length + 1}`);
      values.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY call_number DESC NULLS LAST';
    
    const result = await sql.query(query, values);
    
    return NextResponse.json({
      message: 'Call records retrieved',
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error retrieving call records:', error);
    
    return NextResponse.json({
      message: 'Error retrieving call records',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const querySessionId = searchParams.get('session_id');
    
    const body = await request.json();
    
    // Validate the update payload
    const validatedData = completeCallRecordSchema.parse(body);
    
    // Extract the session_id, preferring the one in the body
    const session_id = validatedData.session_id || querySessionId;
    
    if (!session_id) {
      return NextResponse.json({
        message: 'Missing session_id parameter',
      }, { status: 400 });
    }
    
    // Remove the session_id from the fields to update
    const { session_id: _, ...fieldsToUpdate } = validatedData;
    
    // Prepare the update fields and values
    const entries = Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined);
    
    if (entries.length === 0) {
      return NextResponse.json({
        message: 'No fields to update',
      }, { status: 400 });
    }
    
    // Special handling for call_date if it's provided
    const updateFields = entries.map(([key, value], index) => {
      if (key === 'call_date' && typeof value === 'string') {
        // Try to format as a timestamp using a flexible approach
        return `${key} = to_timestamp($${index + 1}, 'Mon DD, YYYY HH12:MI AM')`;
      }
      return `${key} = $${index + 1}`;
    });
    
    const updateValues = entries.map(([_, value]) => value);
    
    // Build and execute the update query
    const query = `
      UPDATE call_records_av 
      SET ${updateFields.join(', ')} 
      WHERE session_id = $${entries.length + 1}
      RETURNING *
    `;
    
    const result = await sql.query(query, [...updateValues, session_id]);
    
    if (result.rowCount === 0) {
      return NextResponse.json({
        message: 'Call record not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'Call record updated',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating call record:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      message: 'Error updating call record',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
