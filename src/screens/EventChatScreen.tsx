import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from '../types';
import { sendMessage as sendMessageToFirestore, subscribeToMessages } from '../services/messageService';
import { useUser } from '../context/UserContext';

export default function EventChatScreen({ route, navigation }: any) {
  const { event } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { currentUser } = useUser();
  const currentUserId = currentUser?.id || '1';
  const currentUserName = currentUser?.name || 'You';

  // Subscribe to real-time messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages(
      event.id, 
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
        setError(null);
        
        // Scroll to bottom when new messages arrive
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
      (err) => {
        console.error('Chat error:', err);
        setLoading(false);
        
        // Check if it's an index error
        if (err.code === 'failed-precondition' || err.message?.includes('index')) {
          setError('Setting up chat... Please check Firebase Console for index creation link.');
        } else {
          setError('Failed to load messages. Please try again.');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [event.id]);

  const sendMessage = async () => {
    if (inputText.trim() && !sending) {
      const messageText = inputText.trim();
      setInputText(''); // Clear input immediately for better UX
      setSending(true);
      
      try {
        await sendMessageToFirestore(
          event.id,
          currentUserId,
          currentUserName,
          messageText
        );
        
        // Message will appear automatically via real-time listener
      } catch (error) {
        console.error('Failed to send message:', error);
        // Restore input text on error
        setInputText(messageText);
      } finally {
        setSending(false);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.userId === currentUserId;
    return (
      <View style={[styles.messageRow, isMyMessage && styles.myMessageRow]}>
        <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
          {!isMyMessage && <Text style={styles.userName}>{item.userName}</Text>}
          <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>{item.text}</Text>
          <Text style={[styles.timestamp, isMyMessage && styles.myTimestamp]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2C3B4D" />
        <Text style={styles.loadingText}>Loading messages...</Text>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>Check browser console for details</Text>
          </View>
        )}
      </View>
    );
  }

  if (error && messages.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Chat Setup Needed</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButtonError}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonErrorText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <View style={styles.chatHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.chatTitle}>{event.title}</Text>
          <Text style={styles.chatSubtitle}>{event.participants.length} participants</Text>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Be the first to say something!</Text>
          </View>
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message"
          placeholderTextColor="#667781"
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, sending && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={sending}
        >
          <Text style={styles.sendButtonText}>{sending ? '...' : '➤'}</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2C3B4D' },
  container: { flex: 1, backgroundColor: '#F0F3FF' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#636E72', fontWeight: '600' },
  chatHeader: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3B4D', 
    padding: 16, 
    paddingTop: 16,
    elevation: 8, 
    shadowColor: '#2C3B4D', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  backIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold'
  },
  headerInfo: {
    flex: 1
  },
  chatTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  chatSubtitle: { fontSize: 13, color: '#DFE6E9', marginTop: 4, fontWeight: '500' },
  messageList: { flex: 1 },
  messageListContent: { padding: 12 },
  messageRow: { marginVertical: 3, flexDirection: 'row' },
  myMessageRow: { justifyContent: 'flex-end' },
  messageBubble: { 
    maxWidth: '75%', 
    padding: 12, 
    borderRadius: 18, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3 
  },
  otherMessage: { backgroundColor: '#fff', alignSelf: 'flex-start', borderTopLeftRadius: 4 },
  myMessage: { backgroundColor: '#2C3B4D', alignSelf: 'flex-end', borderTopRightRadius: 4 },
  userName: { fontSize: 13, fontWeight: '700', color: '#2C3B4D', marginBottom: 4 },
  messageText: { fontSize: 15, color: '#2D3436', lineHeight: 22 },
  myMessageText: { color: '#fff' },
  timestamp: { fontSize: 11, color: '#636E72', marginTop: 6, alignSelf: 'flex-end', fontWeight: '500' },
  myTimestamp: { color: '#DFE6E9' },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 12, 
    backgroundColor: '#fff', 
    alignItems: 'flex-end', 
    borderTopWidth: 1, 
    borderTopColor: '#E9EDEF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  input: { 
    flex: 1, 
    backgroundColor: '#F2F1ED', 
    borderRadius: 24, 
    paddingHorizontal: 18, 
    paddingVertical: 12, 
    marginRight: 10, 
    maxHeight: 100, 
    fontSize: 15, 
    color: '#2D3436',
    borderWidth: 1,
    borderColor: '#E9EDEF'
  },
  sendButton: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#FFB162', 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#FFB162',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  sendButtonDisabled: {
    backgroundColor: '#C9C1B1',
    opacity: 0.6
  },
  sendButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#636E72'
  },
  errorContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    marginHorizontal: 20
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8
  },
  errorHint: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12
  },
  errorMessage: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40
  },
  retryButton: {
    backgroundColor: '#FFB162',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  backButtonError: {
    paddingHorizontal: 32,
    paddingVertical: 12
  },
  backButtonErrorText: {
    color: '#636E72',
    fontSize: 16,
    fontWeight: '600'
  }
});
