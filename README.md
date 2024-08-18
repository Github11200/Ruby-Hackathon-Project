
---
# 🚀 Headstarter Fellowship Hackathon - Ruby Track

## Project: AI-Powered Complaint Categorization System for Spend Ruby 💼

### 📝 Overview
This project is part of the Ruby Track Hackathon in the [Headstarter Fellowship](https://headstarter.co/). The hackathon features 7 companies, each looking to hire top talent. As part of this challenge, our team has chosen to work with [Spend Ruby](https://spendruby.com/), a financial platform designed for modern businesses. The goal of this project is to develop an AI-powered system that categorizes consumer complaints, providing meaningful insights and improving customer service.

### 💡 Project Description
We are developing an AI-powered complaint categorization system that processes text-based consumer complaints. The system will:

1. **Process Consumer Complaints**: Analyze text, audio, and image based complaints submitted by consumers.
2. **Categorize Complaints**: Assign appropriate product and sub-product categories to each complaint.
3. **Store Categorized Data**: Saved the categorized complaints in a database and vector database for RAG pipeline.
4. **Enhance with a RAG Pipeline**: Implemented a Retrieval-Augmented Generation (RAG) pipeline using a vector database to retrieve and compare related complaints based on similarity.

### 🔑 Key Features
- **Text Processing**: Utilize natural language processing (NLP) techniques to understand and process consumer complaints.
- **Categorization**: Employ machine learning models to accurately categorize complaints into predefined product and sub-product categories.
- **Database Integration**: Store the categorized data in a robust database system for easy access and management.
- **RAG Pipeline**: Use a RAG pipeline to improve the retrieval of similar complaints, aiding in better analysis and resolution.

### 🛠️ Technologies Used
Overall architecture diagram:
![image](https://github.com/user-attachments/assets/8bd6743b-8925-4c77-9866-50a11c1d51c4)

- **Frontend**:
   - HTML for user input forms and app structure.
   - Tailwind CSS framework for rapidly styling and customizing our app.
   - Shadcn Components to easily tweak styles, themes, and behaviors.

- **Backend**: 
   - [NextJS](https://nextjs.org/) for rapid routing API development.
   - [Supabase](https://supabase.com/) PostgreSQL built-in database for relational data, and for the vector database
   - [LangChain RAG Pipeline](https://python.langchain.com/v0.2/docs/tutorials/rag/) for integration with Pinecone to enable retrieval of similar complaints.
   - [Google Gemini API](https://ai.google.dev/) for complaint categorization and summary generation.
   - [Hugging face Whisper model](https://huggingface.co/openai/whisper-large-v3) for speech to text
   - [OCR Space](https://ocr.space/ocrapi) for image to text

### 👥 Team Members
- **Jinay Patel** - [GitHub](https://github.com/Github11200)
- **Abdelghani Bensaïh** - [GitHub](https://github.com/yourusername)
- **Nebila Wako** - [GitHub](https://github.com/nebilawako)

### 📞 Contact
For any inquiries or further information, please feel free to contact us.

We are excited to work on this project and contribute to Spend Ruby's mission of providing a modern financial platform for businesses. 🌟

---

