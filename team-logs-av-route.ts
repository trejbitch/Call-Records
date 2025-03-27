src/app/api/team-logs-av/route.ts






import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get('teamId');
    const memberId = searchParams.get('memberId');
    
    if (!teamId && !memberId) {
      return NextResponse.json({
        message: 'Missing required parameters: teamId or memberId',
      }, { status: 400 });
    }
    
    let query = `
      SELECT 
        cr.id,
        cr.member_id,
        cr.team_id,
        cr.session_id,
        cr.call_number,
        cr.bot_name,
        cr.bot_picture,
        cr.bot_name AS agent_name,
        cr.bot_picture AS agent_picture,
        cr.average_score AS overall_score,
        cr.engagement_score,
        cr.objection_handling_score,
        cr.information_gathering_score,
        cr.program_explanation_score,
        cr.closing_skills_score,
        cr.effectiveness_score AS overall_effectiveness_score,
        cr.call_date AS date,
        cr.call_length AS duration,
        cr.engagement_text,
        cr.objection_handling_text,
        cr.information_gathering_text,
        cr.program_explanation_text,
        cr.closing_skills_text,
        cr.effectiveness_text AS overall_effectiveness_text,
        cr.power_moment,
        cr.key_wins,
        cr.areas_for_growth,
        cr.call_notes,
        cr.managers_feedback AS manager_feedback,
        cr.call_recording AS call_recording_url,
        cr.call_transcript AS transcript,
        cr.status,
        cr.bot_talk_percentage,
        cr.user_talk_percentage,
        cr.monologues_time,
        cr.response_time,
        cr.turn_switches,
        cr.most_used_phrases,
        cr.speaking_pace,
        cr.average_sentence_length,
        cr.filler_words_percentage,
        cr.filler_words_used,
        cr.listening_skills_analysis,
        'Creative Finance' AS avatar_category,
        'Intermediate' AS avatar_difficulty,
        cr.level_up_plan_1,
        cr.level_up_plan_2,
        cr.level_up_plan_3
      FROM call_records_av cr
      WHERE 
    `;
    
    const conditions = [];
    const values = [];
    
    if (teamId) {
      conditions.push(`cr.team_id = $${values.length + 1}`);
      values.push(teamId);
    }
    
    if (memberId) {
      conditions.push(`cr.member_id = $${values.length + 1}`);
      values.push(memberId);
    }
    
    // Only return completed records for team logs
    conditions.push(`cr.status = 'completed'`);
    
    query += conditions.join(' AND ');
    query += ' ORDER BY cr.call_date DESC NULLS LAST';
    
    const result = await sql.query(query, values);
    
    // Process results to match expected format in the frontend
    const formattedResults = result.rows.map(row => {
      // Extract level up plans from key_wins and areas_for_growth if needed
      if (!row.level_up_plan_1 && row.areas_for_growth) {
        const areas = row.areas_for_growth.split('|');
        row.level_up_plan_1 = areas[0] || '';
        row.level_up_plan_2 = areas[1] || '';
        row.level_up_plan_3 = areas[2] || '';
      }
      
      // Format date string if it exists
      if (row.date) {
        const date = new Date(row.date);
        row.date = date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      }
      
      return row;
    });
    
    return NextResponse.json(formattedResults);
    
  } catch (error) {
    console.error('Error retrieving team logs:', error);
    
    return NextResponse.json({
      message: 'Error retrieving team logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Support both naming conventions (member_id and memberId)
    const member_id = searchParams.get('member_id') || searchParams.get('memberId');
    const session_id = searchParams.get('session_id');
    
    if (!member_id || !session_id) {
      return NextResponse.json({
        message: 'Missing required parameters: member_id/memberId and session_id',
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Convert manager_feedback to managers_feedback for database field name
    if (body.manager_feedback !== undefined && body.managers_feedback === undefined) {
      body.managers_feedback = body.manager_feedback;
      delete body.manager_feedback;
    }
    
    // Prepare the update values
    const updates = Object.entries(body)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = $${key}`);
    
    if (updates.length === 0) {
      return NextResponse.json({
        message: 'No fields to update',
      }, { status: 400 });
    }
    
    // Build the parameter object for the query
    const params = Object.entries(body).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[`$${key}`] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Add the where clause parameters
    params.$member_id = member_id;
    params.$session_id = session_id;
    
    // Execute the update query
    const query = `
      UPDATE call_records_av 
      SET ${updates.join(', ')} 
      WHERE member_id = $member_id AND session_id = $session_id 
      RETURNING *
    `;
    
    const result = await sql.query(query, params);
    
    if (result.rowCount === 0) {
      return NextResponse.json({
        message: 'No record found with the provided member_id and session_id',
      }, { status: 404 });
    }
    
    // Format response to match expected frontend format
    const updatedRecord = result.rows[0];
    const formattedResponse = {
      ...updatedRecord,
      manager_feedback: updatedRecord.managers_feedback,
      overall_score: updatedRecord.average_score,
      overall_effectiveness_score: updatedRecord.effectiveness_score,
      agent_name: updatedRecord.bot_name,
      agent_picture: updatedRecord.bot_picture,
      call_recording_url: updatedRecord.call_recording,
      transcript: updatedRecord.call_transcript,
      date: updatedRecord.call_date ? new Date(updatedRecord.call_date).toLocaleString() : '',
      duration: updatedRecord.call_length
    };
    
    return NextResponse.json({
      message: 'Record updated successfully',
      data: formattedResponse,
    });
    
  } catch (error) {
    console.error('Error updating team log:', error);
    
    return NextResponse.json({
      message: 'Error updating team log',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
