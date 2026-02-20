import React from 'react';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';

export default function TransitionPlan({ user }) {

    // A dynamic structured plan based on the user's target industry
    // In a full DB setup, this would be fetched from a headless CMS or database table
    const getPlanDetails = (target) => {
        const defaultPlan = [
            { id: 1, title: 'Map Existing Valid Skills', description: 'Identify how your existing mid-career experience maps onto core competencies needed in your new field.', status: 'completed' },
            { id: 2, title: 'Skill Gap Analysis & Upskilling', description: 'Identify what technical tools you are missing. Find accelerated bootcamps or certificate courses tailored for working adults.', status: 'in-progress' },
            { id: 3, title: 'Portfolio & Reputation Build', description: `Create 2-3 strong portfolio pieces focusing specifically on ${target || 'your new field'}.`, status: 'pending' },
            { id: 4, title: 'Network with Transitioners', description: 'Begin conducting informational interviews with professionals who successfully made this pivot.', status: 'pending' },
            { id: 5, title: 'Targeted Job Application', description: `Craft a narrative-driven resume explaining your transition. Apply to mid-level roles that value your holistic background.`, status: 'pending' }
        ];
        return defaultPlan;
    };

    const steps = getPlanDetails(user.targetIndustry);

    return (
        <section className="dashboard-section section-plan">
            <div className="section-header">
                <h2>Your Structured Transition Plan</h2>
                <p>A proven, five-step roadmap for your pivot to <strong>{user.targetIndustry}</strong>.</p>
            </div>

            <div className="plan-timeline">
                {steps.map((step, index) => (
                    <div key={step.id} className={`plan-step ${step.status}`}>
                        <div className="step-indicator">
                            {step.status === 'completed' && <CheckCircle className="icon-completed" size={28} />}
                            {step.status === 'in-progress' && <PlayCircle className="icon-active" size={28} />}
                            {step.status === 'pending' && <Circle className="icon-pending" size={28} />}
                            {index < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                        <div className="step-content">
                            <h3>Step {step.id}: {step.title}</h3>
                            <p>{step.description}</p>
                            {step.status === 'in-progress' && (
                                <button className="btn btn-primary btn-sm mt-2">Resume Module</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
