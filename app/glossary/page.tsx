'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, BookOpen } from 'lucide-react';
import { FINANCE_GLOSSARY } from '@/lib/games';

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = Object.entries(FINANCE_GLOSSARY).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-[#00F5D4] mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] bg-clip-text text-transparent">
              Finance Glossary
            </h1>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xl text-gray-300 mb-6">
            Master the language of finance. Search through key terms and concepts used in the games.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-[#00F5D4]"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredTerms.map(([key, value]) => (
            <Card key={key} className="bg-gray-900/50 border-gray-700 hover:border-[#00F5D4]/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#00F5D4]">{value.term}</CardTitle>
                {key !== value.term && (
                  <CardDescription className="text-gray-400 text-sm">
                    Also known as: {key}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {value.definition}
                </p>
                <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-[#7C3AED]">
                  <p className="text-sm text-gray-400 mb-1 font-semibold">Example:</p>
                  <p className="text-sm text-gray-300 italic">
                    {value.example}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No terms found matching &ldquo;{searchTerm}&rdquo;
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try a different search term or browse all available terms.
            </p>
          </div>
        )}

        <div className="text-center mt-12 p-6 bg-gray-900/30 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Want to learn more?</h3>
          <p className="text-gray-400 mb-4">
            These terms come to life in our interactive games. Practice makes perfect!
          </p>
          <Link href="/games">
            <Button className="bg-gradient-to-r from-[#00F5D4] to-[#7C3AED] hover:from-[#00F5D4]/80 hover:to-[#7C3AED]/80 text-black font-semibold">
              Play Games
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}