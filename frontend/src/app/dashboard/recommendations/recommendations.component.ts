import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'recommendation' | 'analysis';
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: 'santé' | 'fitness' | 'nutrition' | 'bien-être';
  priority: 'high' | 'medium' | 'low';
  actionItems: string[];
}

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="recommendations-container">
      <div class="recommendations-header">
        <h1>Recommandations IA</h1>
        <div class="ai-status">
          <span class="status-indicator"></span>
          <span>IA Active</span>
        </div>
      </div>

      <div class="recommendations-content">
        <!-- Chat et recommandations -->
        <div class="chat-section">
          <div class="chat-messages" #chatContainer>
            <div *ngFor="let message of messages" 
                 [ngClass]="{'message-user': message.sender === 'user', 'message-ai': message.sender === 'ai'}">
              <div class="message-content">
                <div class="message-header">
                  <span class="sender">{{ message.sender === 'user' ? 'Vous' : 'IA' }}</span>
                  <span class="timestamp">{{ message.timestamp | date:'HH:mm' }}</span>
                </div>
                
                <div class="message-body" *ngIf="message.type === 'text'">
                  {{ message.content }}
                </div>
                
                <div class="recommendation-card" *ngIf="message.type === 'recommendation'">
                  <h3>{{ message.content }}</h3>
                  <p>Basé sur vos données et objectifs, voici une recommandation personnalisée :</p>
                  <ul>
                    <li *ngFor="let item of getRecommendation(message.id)?.actionItems">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                
                <div class="analysis-card" *ngIf="message.type === 'analysis'">
                  <h3>Analyse de vos données</h3>
                  <p>{{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <form [formGroup]="chatForm" (ngSubmit)="sendMessage()" class="chat-input">
            <input type="text" 
                   formControlName="message" 
                   placeholder="Posez une question ou demandez une recommandation..."
                   class="message-input">
            <button type="submit" 
                    [disabled]="!chatForm.valid || isLoading" 
                    class="send-btn">
              <span *ngIf="!isLoading">Envoyer</span>
              <span *ngIf="isLoading">Envoi...</span>
            </button>
          </form>
        </div>

        <!-- Statistiques et insights -->
        <div class="insights-section">
          <h2>Insights et Analyses</h2>
          
          <div class="insights-grid">
            <div class="insight-card">
              <h3>Progression globale</h3>
              <div class="progress-circle">
                <div class="progress" [style.transform]="'rotate(' + (globalProgress * 3.6) + 'deg)'"></div>
                <div class="progress-value">{{ globalProgress }}%</div>
              </div>
            </div>
            
            <div class="insight-card">
              <h3>Points d'amélioration</h3>
              <ul class="improvement-list">
                <li *ngFor="let point of improvementPoints">
                  {{ point }}
                </li>
              </ul>
            </div>
            
            <div class="insight-card">
              <h3>Recommandations récentes</h3>
              <div class="recommendations-list">
                <div *ngFor="let rec of recentRecommendations" 
                     class="recommendation-item">
                  <span class="rec-category">{{ rec.category }}</span>
                  <p>{{ rec.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recommendations-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .recommendations-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .ai-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      background-color: #4CAF50;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    .recommendations-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .chat-section {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      height: 600px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .message-user, .message-ai {
      margin-bottom: 1rem;
      max-width: 80%;
    }

    .message-user {
      margin-left: auto;
    }

    .message-ai {
      margin-right: auto;
    }

    .message-content {
      padding: 1rem;
      border-radius: 10px;
    }

    .message-user .message-content {
      background-color: var(--primary-color);
      color: white;
    }

    .message-ai .message-content {
      background-color: #f8f9fa;
      color: var(--text-color);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .chat-input {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-top: 1px solid #eee;
    }

    .message-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .send-btn {
      padding: 0.75rem 1.5rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .send-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .recommendation-card, .analysis-card {
      background-color: white;
      border-radius: 5px;
      padding: 1rem;
      margin-top: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .insights-section {
      background-color: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .insights-grid {
      display: grid;
      gap: 1.5rem;
    }

    .insight-card {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 5px;
    }

    .progress-circle {
      width: 120px;
      height: 120px;
      margin: 1rem auto;
      position: relative;
      border-radius: 50%;
      background-color: #e9ecef;
    }

    .progress {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      clip: rect(0, 60px, 120px, 0);
      background-color: var(--primary-color);
    }

    .progress-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      font-weight: bold;
    }

    .improvement-list {
      list-style-type: none;
      padding: 0;
    }

    .improvement-list li {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      background-color: white;
      border-radius: 3px;
    }

    .recommendations-list {
      display: grid;
      gap: 1rem;
    }

    .recommendation-item {
      padding: 0.75rem;
      background-color: white;
      border-radius: 3px;
    }

    .rec-category {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background-color: var(--primary-color);
      color: white;
      border-radius: 3px;
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .recommendations-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RecommendationsComponent {
  messages: Message[] = [];
  isLoading = false;
  globalProgress = 75;
  improvementPoints = [
    'Augmenter la fréquence des exercices',
    'Améliorer la qualité du sommeil',
    'Réduire la consommation de sucre'
  ];
  recentRecommendations: Recommendation[] = [
    {
      id: 1,
      title: 'Plan d\'entraînement personnalisé',
      description: 'Basé sur vos performances récentes',
      category: 'fitness',
      priority: 'high',
      actionItems: ['3 séances de cardio par semaine', '2 séances de musculation']
    },
    {
      id: 2,
      title: 'Régime alimentaire équilibré',
      description: 'Optimisé pour vos objectifs',
      category: 'nutrition',
      priority: 'medium',
      actionItems: ['Augmenter les protéines', 'Réduire les glucides simples']
    }
  ];
  
  chatForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });

    // Message de bienvenue de l'IA
    this.messages.push({
      id: 1,
      content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    });
  }

  sendMessage() {
    if (this.chatForm.valid) {
      const userMessage = this.chatForm.value.message;
      
      // Ajouter le message de l'utilisateur
      this.messages.push({
        id: this.messages.length + 1,
        content: userMessage,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      });

      this.isLoading = true;
      this.chatForm.reset();

      // Simuler une réponse de l'IA
      setTimeout(() => {
        this.messages.push({
          id: this.messages.length + 1,
          content: 'Voici une recommandation basée sur votre question :',
          sender: 'ai',
          timestamp: new Date(),
          type: 'recommendation'
        });
        this.isLoading = false;
      }, 1000);
    }
  }

  getRecommendation(id: number): Recommendation | undefined {
    return this.recentRecommendations.find(rec => rec.id === id);
  }
} 