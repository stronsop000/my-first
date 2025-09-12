import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { User } from '../../types';
import { getXpProgress } from '../../utils/xpSystem';

interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onProfile?: () => void;
}

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, ${theme.colors.primary.blue}, ${theme.colors.primary.green});
  color: ${theme.colors.neutral.white};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadows.medium};
`;

const Logo = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  cursor: pointer;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Username = styled.span`
  font-family: ${theme.fonts.heading};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const XpBar = styled.div`
  width: 120px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
`;

const XpProgress = styled.div<{ progress: number }>`
  width: ${props => props.progress * 100}%;
  height: 100%;
  background: ${theme.colors.accent.yellow};
  transition: width ${theme.transitions.medium};
`;

const Level = styled.span`
  background: ${theme.colors.accent.yellow};
  color: ${theme.colors.neutral.dark};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: ${theme.fonts.heading};
`;

const LoginButton = styled.button`
  background: ${theme.colors.accent.yellow};
  color: ${theme.colors.neutral.dark};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: ${theme.fonts.heading};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }
`;

export const Header: React.FC<HeaderProps> = ({ user, onLogin, onProfile }) => {
  const xpProgress = user ? getXpProgress(user.xp) : null;

  return (
    <HeaderContainer>
      <Logo>🎮 Finance Arcade</Logo>
      <UserSection>
        {user ? (
          <>
            <UserInfo>
              <Username>{user.username}</Username>
              <XpBar>
                <XpProgress progress={xpProgress?.progress || 0} />
              </XpBar>
            </UserInfo>
            <Level>LVL {user.level}</Level>
          </>
        ) : (
          <LoginButton onClick={onLogin}>
            Sign In
          </LoginButton>
        )}
      </UserSection>
    </HeaderContainer>
  );
};